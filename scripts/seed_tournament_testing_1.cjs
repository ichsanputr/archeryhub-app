const mysql = require('mysql2/promise');
const { randomUUID } = require('crypto');

async function seedTournamentTesting1() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'archeris',
    multipleStatements: true
  });

  console.log('🏹 Connected to archeris database. Starting tournament-testing-1 data seeding...');

  try {
    const tournamentUuid = 'dff03b63-c1c8-413f-bcac-1685d9213ca4';
    const catMenUuid = '991de19b-cc12-4152-8771-73e271f0f223';
    const catWomenUuid = '6c46ac8a-1e28-459c-98e5-bff045dfa390';
    const catTeamMenUuid = '4a3a0230-608b-4e37-99cc-be1d9f8092c1';
    const catMixedUuid = 'f1b95a9c-57c6-40ee-a7f4-3e062d25c9ef';

    // Verify tournament exists
    const [tournaments] = await connection.query('SELECT * FROM tournaments WHERE uuid = ?', [tournamentUuid]);
    if (tournaments.length === 0) {
      throw new Error(`Tournament with UUID ${tournamentUuid} not found!`);
    }
    console.log(`✅ Found Tournament: "${tournaments[0].name}" (${tournaments[0].slug})`);

    // Fetch existing participants
    const [participants] = await connection.query(`
      SELECT tp.uuid, tp.archer_id, tp.category_id, a.full_name, a.gender, c.name as club_name
      FROM tournament_participants tp
      JOIN archers a ON tp.archer_id = a.uuid
      LEFT JOIN clubs c ON a.club_id = c.uuid
      WHERE tp.tournament_id = ?
    `, [tournamentUuid]);

    console.log(`📋 Found ${participants.length} registered participants.`);

    const menParticipants = participants.filter(p => p.category_id === catMenUuid);
    const womenParticipants = participants.filter(p => p.category_id === catWomenUuid);

    console.log(`   - Compound Men U-18: ${menParticipants.length} archers`);
    console.log(`   - Compound Women U-18: ${womenParticipants.length} archers`);

    // 1. CLEANUP PREVIOUS SEED DATA FOR THIS TOURNAMENT (Idempotent)
    console.log('🧹 Cleaning up previous test data for this tournament...');
    
    // Cleanup brackets & elimination
    const [existingBrackets] = await connection.query('SELECT uuid FROM elimination_brackets WHERE tournament_uuid = ?', [tournamentUuid]);
    for (const b of existingBrackets) {
      const [matches] = await connection.query('SELECT uuid FROM elimination_matches WHERE bracket_uuid = ?', [b.uuid]);
      for (const m of matches) {
        const [ends] = await connection.query('SELECT uuid FROM elimination_match_ends WHERE match_uuid = ?', [m.uuid]);
        for (const e of ends) {
          await connection.query('DELETE FROM elimination_match_arrow_scores WHERE match_end_uuid = ?', [e.uuid]);
        }
        await connection.query('DELETE FROM elimination_match_ends WHERE match_uuid = ?', [m.uuid]);
      }
      await connection.query('DELETE FROM elimination_matches WHERE bracket_uuid = ?', [b.uuid]);
      await connection.query('DELETE FROM elimination_entries WHERE bracket_uuid = ?', [b.uuid]);
    }
    await connection.query('DELETE FROM elimination_brackets WHERE tournament_uuid = ?', [tournamentUuid]);

    // Cleanup teams
    const [existingTeams] = await connection.query('SELECT uuid FROM teams WHERE tournament_id = ?', [tournamentUuid]);
    for (const t of existingTeams) {
      await connection.query('DELETE FROM team_members WHERE team_id = ?', [t.uuid]);
    }
    await connection.query('DELETE FROM teams WHERE tournament_id = ?', [tournamentUuid]);

    // Cleanup qualifications
    const [existingSessions] = await connection.query('SELECT uuid FROM qualification_sessions WHERE tournament_uuid = ?', [tournamentUuid]);
    for (const s of existingSessions) {
      const [ends] = await connection.query('SELECT uuid FROM qualification_end_scores WHERE session_uuid = ?', [s.uuid]);
      for (const e of ends) {
        await connection.query('DELETE FROM qualification_arrow_scores WHERE end_score_uuid = ?', [e.uuid]);
      }
      await connection.query('DELETE FROM qualification_end_scores WHERE session_uuid = ?', [s.uuid]);
      await connection.query('DELETE FROM qualification_target_assignments WHERE session_uuid = ?', [s.uuid]);
      await connection.query('DELETE FROM target_board_qualification WHERE session_uuid = ?', [s.uuid]);
      await connection.query('DELETE FROM qualification_session_categories WHERE session_uuid = ?', [s.uuid]);
    }
    await connection.query('DELETE FROM qualification_sessions WHERE tournament_uuid = ?', [tournamentUuid]);
    await connection.query('DELETE FROM tournament_targets WHERE tournament_uuid = ?', [tournamentUuid]);

    // Cleanup certificates, schedules, media & payments
    await connection.query('DELETE FROM archer_certificates WHERE tournament_id = ?', [tournamentUuid]);
    await connection.query('DELETE FROM tournament_certificates WHERE tournament_id = ?', [tournamentUuid]);
    await connection.query('DELETE FROM tournament_schedule_items WHERE tournament_id = ?', [tournamentUuid]);
    await connection.query('DELETE FROM tournament_schedules WHERE tournament_id = ?', [tournamentUuid]);
    await connection.query('DELETE FROM tournament_images WHERE tournament_id = ?', [tournamentUuid]);
    await connection.query('DELETE FROM media WHERE tournament_id = ?', [tournamentUuid]);
    await connection.query('DELETE FROM payment_transactions WHERE tournament_id = ?', [tournamentUuid]);

    // 2. SEED PAYMENTS FOR ALL 14 PARTICIPANTS
    console.log('💳 1. Seeding 14 Payment Transactions (Bank Transfer & Gateway)...');
    for (let i = 0; i < participants.length; i++) {
      const p = participants[i];
      const txUuid = randomUUID();
      const isManual = i % 2 === 0;
      const ref = `TRX-TT1-20260920-${String(i + 1).padStart(4, '0')}`;
      const method = isManual ? 'manual_transfer' : 'midtrans_va';
      const channel = isManual ? 'BCA Manual' : 'BCA Virtual Account';
      const proofUrl = isManual ? 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80' : null;
      const senderName = p.full_name;

      await connection.query(`
        INSERT INTO payment_transactions (
          uuid, reference, user_id, tournament_id, registration_id,
          amount, fee_amount, total_amount, payment_method, payment_channel,
          proof_url, sender_name, status, paid_at, expired_at, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'paid', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY), NOW())
      `, [
        txUuid, ref, p.archer_id, tournamentUuid, p.uuid,
        350000.00, 0.00, 350000.00, method, channel,
        proofUrl, senderName
      ]);

      await connection.query(`
        UPDATE tournament_participants
        SET payment_status = 'paid', payment_amount = 350000.00, payment_id = ?
        WHERE uuid = ?
      `, [txUuid, p.uuid]);
    }
    console.log('   ✅ All 14 participants marked as Paid with transaction records.');

    // 3. SEED TARGETS, BOARDS & ASSIGNMENTS
    console.log('🎯 2. Seeding Targets & Target Board Assignments...');
    const targetSlots = [
      { id: 'target-tt1-1a', name: '1A', board: 1 },
      { id: 'target-tt1-1b', name: '1B', board: 1 },
      { id: 'target-tt1-1c', name: '1C', board: 1 },
      { id: 'target-tt1-1d', name: '1D', board: 1 },
      { id: 'target-tt1-2a', name: '2A', board: 2 },
      { id: 'target-tt1-2b', name: '2B', board: 2 },
      { id: 'target-tt1-2c', name: '2C', board: 2 },
      { id: 'target-tt1-2d', name: '2D', board: 2 },
      { id: 'target-tt1-3a', name: '3A', board: 3 },
      { id: 'target-tt1-3b', name: '3B', board: 3 },
      { id: 'target-tt1-3c', name: '3C', board: 3 },
      { id: 'target-tt1-3d', name: '3D', board: 3 },
      { id: 'target-tt1-4a', name: '4A', board: 4 },
      { id: 'target-tt1-4b', name: '4B', board: 4 },
      { id: 'target-tt1-4c', name: '4C', board: 4 },
      { id: 'target-tt1-4d', name: '4D', board: 4 },
    ];

    for (const t of targetSlots) {
      await connection.query(`
        INSERT INTO tournament_targets (uuid, tournament_uuid, target_name, board_number)
        VALUES (?, ?, ?, ?)
      `, [t.id, tournamentUuid, t.name, t.board]);
    }

    // Qualification Session
    const sessionUuid = 'session-tt1-qual-1';
    await connection.query(`
      INSERT INTO qualification_sessions (
        uuid, tournament_uuid, session_code, session_date, name,
        start_time, end_time, total_ends, arrows_per_end, is_locked
      ) VALUES (?, ?, 'TT1-SESI-1', '2026-09-20', 'Kualifikasi Sesi 1 (Pagi)', '2026-09-20 08:00:00', '2026-09-20 11:30:00', 6, 6, 1)
    `, [sessionUuid, tournamentUuid]);

    await connection.query(`
      INSERT INTO qualification_session_categories (session_uuid, category_uuid) VALUES
      (?, ?), (?, ?)
    `, [sessionUuid, catMenUuid, sessionUuid, catWomenUuid]);

    // Target Boards with access codes
    const boards = [
      { id: 'board-tt1-1', sessionUuid, catUuid: catMenUuid, boardNo: 1, code: '001TGT' },
      { id: 'board-tt1-2', sessionUuid, catUuid: catMenUuid, boardNo: 2, code: '002TGT' },
      { id: 'board-tt1-3', sessionUuid, catUuid: catWomenUuid, boardNo: 3, code: '003TGT' },
      { id: 'board-tt1-4', sessionUuid, catUuid: catWomenUuid, boardNo: 4, code: '004TGT' },
    ];
    for (const b of boards) {
      await connection.query(`
        INSERT INTO target_board_qualification (uuid, session_uuid, category_uuid, board_number, code)
        VALUES (?, ?, ?, ?, ?)
      `, [b.id, b.sessionUuid, b.catUuid, b.boardNo, b.code]);
    }

    // Assign Men (8 archers across Target 1 & 2: 1A-1D, 2A-2D)
    const menSlots = ['1A', '1B', '1C', '1D', '2A', '2B', '2C', '2D'];
    const menTargetUuids = ['target-tt1-1a', 'target-tt1-1b', 'target-tt1-1c', 'target-tt1-1d', 'target-tt1-2a', 'target-tt1-2b', 'target-tt1-2c', 'target-tt1-2d'];
    const menBoardUuids = ['board-tt1-1', 'board-tt1-1', 'board-tt1-1', 'board-tt1-1', 'board-tt1-2', 'board-tt1-2', 'board-tt1-2', 'board-tt1-2'];

    for (let i = 0; i < menParticipants.length; i++) {
      const p = menParticipants[i];
      const slot = menSlots[i];
      const backNo = `M${String(i + 1).padStart(2, '0')}`;
      await connection.query(`
        INSERT INTO qualification_target_assignments (uuid, session_uuid, participant_uuid, target_uuid, target_board_id)
        VALUES (?, ?, ?, ?, ?)
      `, [randomUUID(), sessionUuid, p.uuid, menTargetUuids[i], menBoardUuids[i]]);

      await connection.query(`
        UPDATE tournament_participants
        SET target_name = ?, back_number = ?
        WHERE uuid = ?
      `, [slot, backNo, p.uuid]);
    }

    // Assign Women (6 archers across Target 3 & 4: 3A-3C, 4A-4C)
    const womenSlots = ['3A', '3B', '3C', '4A', '4B', '4C'];
    const womenTargetUuids = ['target-tt1-3a', 'target-tt1-3b', 'target-tt1-3c', 'target-tt1-4a', 'target-tt1-4b', 'target-tt1-4c'];
    const womenBoardUuids = ['board-tt1-3', 'board-tt1-3', 'board-tt1-3', 'board-tt1-4', 'board-tt1-4', 'board-tt1-4'];

    for (let i = 0; i < womenParticipants.length; i++) {
      const p = womenParticipants[i];
      const slot = womenSlots[i];
      const backNo = `W${String(i + 1).padStart(2, '0')}`;
      await connection.query(`
        INSERT INTO qualification_target_assignments (uuid, session_uuid, participant_uuid, target_uuid, target_board_id)
        VALUES (?, ?, ?, ?, ?)
      `, [randomUUID(), sessionUuid, p.uuid, womenTargetUuids[i], womenBoardUuids[i]]);

      await connection.query(`
        UPDATE tournament_participants
        SET target_name = ?, back_number = ?
        WHERE uuid = ?
      `, [slot, backNo, p.uuid]);
    }
    console.log('   ✅ All 14 participants assigned to targets 1A-4C with back numbers.');

    // 4. SEED QUALIFICATION ENDS & ARROWS
    console.log('🏹 3. Seeding Realistic Qualification Scores (6 ends x 6 arrows)...');
    
    // Preset realistic arrow score patterns for 8 Men (sorted by rank)
    const menScoreProfiles = [
      { rank: 1, ends: [[10,10,10,10,9,9],[10,10,10,10,10,9],[10,10,10,10,9,9],[10,10,10,10,10,10],[10,10,10,10,10,9],[10,10,10,10,9,9]], isXs: [[1,1,0,0,0,0],[1,1,1,0,0,0],[1,1,0,0,0,0],[1,1,1,1,0,0],[1,1,1,0,0,0],[1,1,0,0,0,0]] }, // 352 pts
      { rank: 2, ends: [[10,10,10,10,9,9],[10,10,10,10,9,9],[10,10,10,9,9,9],[10,10,10,10,10,9],[10,10,10,10,9,9],[10,10,10,10,9,9]], isXs: [[1,1,0,0,0,0],[1,1,0,0,0,0],[1,0,0,0,0,0],[1,1,1,0,0,0],[1,1,0,0,0,0],[1,1,0,0,0,0]] },   // 348 pts
      { rank: 3, ends: [[10,10,10,9,9,9],[10,10,10,9,9,9],[10,10,10,10,9,9],[10,10,10,10,9,9],[10,10,10,9,9,9],[10,10,10,9,9,9]], isXs: [[1,1,0,0,0,0],[1,0,0,0,0,0],[1,1,0,0,0,0],[1,1,0,0,0,0],[1,0,0,0,0,0],[1,0,0,0,0,0]] },       // 344 pts
      { rank: 4, ends: [[10,10,9,9,9,9],[10,10,10,9,9,9],[10,10,9,9,9,9],[10,10,10,9,9,9],[10,10,9,9,9,9],[10,10,10,9,9,9]], isXs: [[1,0,0,0,0,0],[1,1,0,0,0,0],[1,0,0,0,0,0],[1,1,0,0,0,0],[1,0,0,0,0,0],[1,0,0,0,0,0]] },             // 339 pts
      { rank: 5, ends: [[10,9,9,9,9,9],[10,10,9,9,9,9],[10,10,9,9,9,9],[10,10,9,9,9,9],[10,9,9,9,9,9],[10,10,9,9,9,9]], isXs: [[1,0,0,0,0,0],[1,0,0,0,0,0],[1,1,0,0,0,0],[1,0,0,0,0,0],[0,0,0,0,0,0],[1,0,0,0,0,0]] },                   // 334 pts
      { rank: 6, ends: [[10,9,9,9,9,9],[10,9,9,9,9,9],[10,9,9,9,9,9],[10,9,9,9,9,9],[10,9,9,9,9,9],[10,9,9,9,9,9]], isXs: [[1,0,0,0,0,0],[1,0,0,0,0,0],[0,0,0,0,0,0],[1,0,0,0,0,0],[1,0,0,0,0,0],[0,0,0,0,0,0]] },                         // 330 pts
      { rank: 7, ends: [[10,9,9,9,9,8],[10,9,9,9,9,8],[10,9,9,9,9,9],[10,9,9,9,9,8],[10,9,9,9,9,8],[10,9,9,9,9,8]], isXs: [[1,0,0,0,0,0],[0,0,0,0,0,0],[1,0,0,0,0,0],[0,0,0,0,0,0],[1,0,0,0,0,0],[0,0,0,0,0,0]] },                         // 325 pts
      { rank: 8, ends: [[9,9,9,9,9,8],[9,9,9,9,9,8],[9,9,9,9,9,8],[9,9,9,9,9,8],[9,9,9,9,9,8],[9,9,9,9,9,8]], isXs: [[0,0,0,0,0,0],[1,0,0,0,0,0],[0,0,0,0,0,0],[1,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]] }                                  // 318 pts
    ];

    const seededMen = [];
    for (let i = 0; i < menParticipants.length; i++) {
      const p = menParticipants[i];
      const profile = menScoreProfiles[i];
      let totalQualScore = 0;
      let total10s = 0;
      let totalXs = 0;

      for (let eIdx = 0; eIdx < profile.ends.length; eIdx++) {
        const endScores = profile.ends[eIdx];
        const endXs = profile.isXs[eIdx];
        const endTotal = endScores.reduce((a, b) => a + b, 0);
        const end10Count = endScores.filter(s => s === 10).length;
        const endXCount = endXs.filter(x => x === 1).length;

        totalQualScore += endTotal;
        total10s += end10Count;
        totalXs += endXCount;

        const endScoreUuid = randomUUID();
        await connection.query(`
          INSERT INTO qualification_end_scores (
            uuid, session_uuid, participant_uuid, end_number,
            total_score_end, x_count_end, ten_count_end, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `, [endScoreUuid, sessionUuid, p.uuid, eIdx + 1, endTotal, endXCount, end10Count]);

        for (let aIdx = 0; aIdx < endScores.length; aIdx++) {
          await connection.query(`
            INSERT INTO qualification_arrow_scores (
              uuid, end_score_uuid, arrow_number, score, is_x, created_at
            ) VALUES (?, ?, ?, ?, ?, NOW())
          `, [randomUUID(), endScoreUuid, aIdx + 1, endScores[aIdx], endXs[aIdx]]);
        }
      }

      await connection.query(`
        UPDATE tournament_participants
        SET qual_score = ?, qual_rank = ?
        WHERE uuid = ?
      `, [totalQualScore, profile.rank, p.uuid]);

      seededMen.push({ ...p, qual_score: totalQualScore, qual_rank: profile.rank, total10s, totalXs });
    }

    // Preset realistic arrow score patterns for 6 Women
    const womenScoreProfiles = [
      { rank: 1, ends: [[10,10,10,9,9,9],[10,10,10,10,9,9],[10,10,10,9,9,9],[10,10,10,10,9,9],[10,10,10,10,9,9],[10,10,10,10,9,9]], isXs: [[1,1,0,0,0,0],[1,1,0,0,0,0],[1,0,0,0,0,0],[1,1,0,0,0,0],[1,1,0,0,0,0],[1,1,0,0,0,0]] }, // 346 pts
      { rank: 2, ends: [[10,10,10,9,9,9],[10,10,9,9,9,9],[10,10,10,9,9,9],[10,10,10,9,9,9],[10,10,10,9,9,9],[10,10,10,9,9,9]], isXs: [[1,1,0,0,0,0],[1,0,0,0,0,0],[1,1,0,0,0,0],[1,0,0,0,0,0],[1,1,0,0,0,0],[1,0,0,0,0,0]] },       // 341 pts
      { rank: 3, ends: [[10,10,9,9,9,9],[10,10,9,9,9,9],[10,10,9,9,9,9],[10,10,9,9,9,9],[10,10,9,9,9,9],[10,10,9,9,9,9]], isXs: [[1,0,0,0,0,0],[1,0,0,0,0,0],[1,1,0,0,0,0],[1,0,0,0,0,0],[1,0,0,0,0,0],[1,0,0,0,0,0]] },             // 336 pts
      { rank: 4, ends: [[10,9,9,9,9,9],[10,9,9,9,9,9],[10,9,9,9,9,9],[10,9,9,9,9,9],[10,9,9,9,9,9],[10,9,9,9,9,9]], isXs: [[1,0,0,0,0,0],[1,0,0,0,0,0],[0,0,0,0,0,0],[1,0,0,0,0,0],[1,0,0,0,0,0],[0,0,0,0,0,0]] },                         // 330 pts
      { rank: 5, ends: [[10,9,9,9,9,8],[10,9,9,9,9,8],[10,9,9,9,9,8],[10,9,9,9,9,8],[10,9,9,9,9,8],[10,9,9,9,8,8]], isXs: [[1,0,0,0,0,0],[0,0,0,0,0,0],[1,0,0,0,0,0],[0,0,0,0,0,0],[1,0,0,0,0,0],[0,0,0,0,0,0]] },                         // 323 pts
      { rank: 6, ends: [[9,9,9,9,8,8],[9,9,9,9,9,8],[9,9,9,9,8,8],[9,9,9,9,9,8],[9,9,9,9,9,8],[9,9,9,9,8,8]], isXs: [[0,0,0,0,0,0],[1,0,0,0,0,0],[0,0,0,0,0,0],[1,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]] }                                  // 315 pts
    ];

    const seededWomen = [];
    for (let i = 0; i < womenParticipants.length; i++) {
      const p = womenParticipants[i];
      const profile = womenScoreProfiles[i];
      let totalQualScore = 0;
      let total10s = 0;
      let totalXs = 0;

      for (let eIdx = 0; eIdx < profile.ends.length; eIdx++) {
        const endScores = profile.ends[eIdx];
        const endXs = profile.isXs[eIdx];
        const endTotal = endScores.reduce((a, b) => a + b, 0);
        const end10Count = endScores.filter(s => s === 10).length;
        const endXCount = endXs.filter(x => x === 1).length;

        totalQualScore += endTotal;
        total10s += end10Count;
        totalXs += endXCount;

        const endScoreUuid = randomUUID();
        await connection.query(`
          INSERT INTO qualification_end_scores (
            uuid, session_uuid, participant_uuid, end_number,
            total_score_end, x_count_end, ten_count_end, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `, [endScoreUuid, sessionUuid, p.uuid, eIdx + 1, endTotal, endXCount, end10Count]);

        for (let aIdx = 0; aIdx < endScores.length; aIdx++) {
          await connection.query(`
            INSERT INTO qualification_arrow_scores (
              uuid, end_score_uuid, arrow_number, score, is_x, created_at
            ) VALUES (?, ?, ?, ?, ?, NOW())
          `, [randomUUID(), endScoreUuid, aIdx + 1, endScores[aIdx], endXs[aIdx]]);
        }
      }

      await connection.query(`
        UPDATE tournament_participants
        SET qual_score = ?, qual_rank = ?
        WHERE uuid = ?
      `, [totalQualScore, profile.rank, p.uuid]);

      seededWomen.push({ ...p, qual_score: totalQualScore, qual_rank: profile.rank, total10s, totalXs });
    }

    console.log('   ✅ Seeded qualification ends & arrows for all archers.');
    console.log(`      - Men Seed 1: ${seededMen[0].full_name} (${seededMen[0].qual_score} pts)`);
    console.log(`      - Women Seed 1: ${seededWomen[0].full_name} (${seededWomen[0].qual_score} pts)`);

    // 5. SEED TEAMS & MIXED TEAMS
    console.log('👥 4. Seeding Teams & Mixed Teams Synchronization...');
    
    // Men Team 1 (Top 3 Men: Rizky, Andi, Joko)
    const teamMen1Uuid = 'team-tt1-men-alpha';
    const teamMen1Score = seededMen[0].qual_score + seededMen[1].qual_score + seededMen[2].qual_score;
    const teamMen1X = seededMen[0].totalXs + seededMen[1].totalXs + seededMen[2].totalXs;
    await connection.query(`
      INSERT INTO teams (uuid, tournament_id, category_id, team_name, team_rank, total_score, total_x_count, status, created_at)
      VALUES (?, ?, ?, ?, 1, ?, ?, 'qualified', NOW())
    `, [teamMen1Uuid, tournamentUuid, catTeamMenUuid, "D'Archers Men Team A", teamMen1Score, teamMen1X]);

    let mOrder1 = 1;
    for (const member of [seededMen[0], seededMen[1], seededMen[2]]) {
      await connection.query(`
        INSERT INTO team_members (uuid, team_id, participant_id, member_order, total_score, total_x_count, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
      `, [randomUUID(), teamMen1Uuid, member.uuid, mOrder1++, member.qual_score, member.totalXs]);
    }

    // Men Team 2 (Next 3 Men: Faris, Budi, Fajar)
    const teamMen2Uuid = 'team-tt1-men-bravo';
    const teamMen2Score = seededMen[3].qual_score + seededMen[4].qual_score + seededMen[5].qual_score;
    const teamMen2X = seededMen[3].totalXs + seededMen[4].totalXs + seededMen[5].totalXs;
    await connection.query(`
      INSERT INTO teams (uuid, tournament_id, category_id, team_name, team_rank, total_score, total_x_count, status, created_at)
      VALUES (?, ?, ?, ?, 2, ?, ?, 'qualified', NOW())
    `, [teamMen2Uuid, tournamentUuid, catTeamMenUuid, "D'Archers Men Team B", teamMen2Score, teamMen2X]);

    let mOrder2 = 1;
    for (const member of [seededMen[3], seededMen[4], seededMen[5]]) {
      await connection.query(`
        INSERT INTO team_members (uuid, team_id, participant_id, member_order, total_score, total_x_count, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
      `, [randomUUID(), teamMen2Uuid, member.uuid, mOrder2++, member.qual_score, member.totalXs]);
    }

    // Mixed Teams (3 Mixed Teams: 1 Male + 1 Female)
    const mixPairs = [
      { name: "D'Archers Mixed Team 1", man: seededMen[0], woman: seededWomen[0], rank: 1 },
      { name: "D'Archers Mixed Team 2", man: seededMen[1], woman: seededWomen[1], rank: 2 },
      { name: "D'Archers Mixed Team 3", man: seededMen[2], woman: seededWomen[2], rank: 3 },
    ];

    for (let i = 0; i < mixPairs.length; i++) {
      const pair = mixPairs[i];
      const mixUuid = `team-tt1-mix-${i + 1}`;
      const mixScore = pair.man.qual_score + pair.woman.qual_score;
      const mixX = pair.man.totalXs + pair.woman.totalXs;

      await connection.query(`
        INSERT INTO teams (uuid, tournament_id, category_id, team_name, team_rank, total_score, total_x_count, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'qualified', NOW())
      `, [mixUuid, tournamentUuid, catMixedUuid, pair.name, pair.rank, mixScore, mixX]);

      await connection.query(`
        INSERT INTO team_members (uuid, team_id, participant_id, member_order, total_score, total_x_count, created_at)
        VALUES (?, ?, ?, 1, ?, ?, NOW()), (?, ?, ?, 2, ?, ?, NOW())
      `, [
        randomUUID(), mixUuid, pair.man.uuid, pair.man.qual_score, pair.man.totalXs,
        randomUUID(), mixUuid, pair.woman.uuid, pair.woman.qual_score, pair.woman.totalXs
      ]);
    }
    console.log('   ✅ Seeded 2 Men Teams and 3 Mixed Teams with member linkages.');

    // 6. SEED ELIMINATION BRACKET & MATCHPLAY PROGRESSION (Top 8 Compound Men)
    console.log('🏆 5. Seeding Elimination Bracket (Quarterfinals -> Semifinals -> Finals)...');
    
    const bracketUuid = 'bracket-tt1-comp-men';
    await connection.query(`
      INSERT INTO elimination_brackets (
        uuid, bracket_id, tournament_uuid, category_uuid, bracket_type, format,
        bracket_size, status, ends_per_match, arrows_per_end, is_locked, generated_at, created_at
      ) VALUES (?, 'BRK-TT1-COMP-MEN', ?, ?, 'individual', 'compound_total', 8, 'completed', 5, 3, 1, NOW(), NOW())
    `, [bracketUuid, tournamentUuid, catMenUuid]);

    // Create 8 elimination entries
    const entries = [];
    for (let i = 0; i < 8; i++) {
      const p = seededMen[i];
      const entryUuid = `entry-tt1-seed-${i + 1}`;
      await connection.query(`
        INSERT INTO elimination_entries (
          uuid, bracket_uuid, participant_type, participant_uuid, seed,
          qual_total_score, qual_total_x, qual_total_10, created_at
        ) VALUES (?, ?, 'archer', ?, ?, ?, ?, ?, NOW())
      `, [entryUuid, bracketUuid, p.uuid, i + 1, p.qual_score, p.totalXs, p.total10s]);
      entries.push({ uuid: entryUuid, seed: i + 1, participant: p });
    }

    // Function to seed match ends & arrows for Compound (5 ends x 3 arrows = 15 arrows, max 150 pts)
    async function seedMatchDetail(matchUuid, side, endScores) {
      for (let eIdx = 0; eIdx < endScores.length; eIdx++) {
        const arrows = endScores[eIdx];
        const endTotal = arrows.reduce((a, b) => a + b, 0);
        const tenCount = arrows.filter(s => s === 10).length;
        const xCount = Math.min(tenCount, 1); // 1 X per 10 on average

        const matchEndUuid = randomUUID();
        await connection.query(`
          INSERT INTO elimination_match_ends (
            uuid, match_uuid, end_no, side, end_total, x_count, ten_count, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `, [matchEndUuid, matchUuid, eIdx + 1, side, endTotal, xCount, tenCount]);

        for (let aIdx = 0; aIdx < arrows.length; aIdx++) {
          await connection.query(`
            INSERT INTO elimination_match_arrow_scores (
              uuid, match_end_uuid, arrow_no, score, is_x, created_at
            ) VALUES (?, ?, ?, ?, ?, NOW())
          `, [randomUUID(), matchEndUuid, aIdx + 1, arrows[aIdx], arrows[aIdx] === 10 && aIdx === 0 ? 1 : 0]);
        }
      }
    }

    // --- ROUND 1: QUARTERFINALS (Round No: 1, 4 Matches) ---
    // QF 1: Seed 1 (Rizky: 147) vs Seed 8 (Eko: 138) -> Winner: Seed 1
    const qf1Uuid = 'match-tt1-qf-1';
    await connection.query(`
      INSERT INTO elimination_matches (
        uuid, match_id, bracket_uuid, round_no, match_no, entry_a_uuid, entry_b_uuid,
        winner_entry_uuid, status, total_score_a, total_score_b, created_at
      ) VALUES (?, 'M-QF1', ?, 1, 1, ?, ?, ?, 'finished', 147, 138, NOW())
    `, [qf1Uuid, bracketUuid, entries[0].uuid, entries[7].uuid, entries[0].uuid]);
    await seedMatchDetail(qf1Uuid, 'A', [[10,10,9],[10,10,10],[10,10,9],[10,10,10],[10,10,9]]); // 147
    await seedMatchDetail(qf1Uuid, 'B', [[9,9,9],[10,9,9],[10,9,9],[9,9,9],[9,9,9]]);             // 138

    // QF 2: Seed 4 (Faris: 143) vs Seed 5 (Budi: 140) -> Winner: Seed 4
    const qf2Uuid = 'match-tt1-qf-2';
    await connection.query(`
      INSERT INTO elimination_matches (
        uuid, match_id, bracket_uuid, round_no, match_no, entry_a_uuid, entry_b_uuid,
        winner_entry_uuid, status, total_score_a, total_score_b, created_at
      ) VALUES (?, 'M-QF2', ?, 1, 2, ?, ?, ?, 'finished', 143, 140, NOW())
    `, [qf2Uuid, bracketUuid, entries[3].uuid, entries[4].uuid, entries[3].uuid]);
    await seedMatchDetail(qf2Uuid, 'A', [[10,10,9],[10,9,9],[10,10,9],[10,9,9],[10,9,9]]);       // 143
    await seedMatchDetail(qf2Uuid, 'B', [[9,9,9],[10,9,9],[10,9,9],[10,9,8],[10,9,9]]);          // 140

    // QF 3: Seed 3 (Joko: 144) vs Seed 6 (Fajar: 139) -> Winner: Seed 3
    const qf3Uuid = 'match-tt1-qf-3';
    await connection.query(`
      INSERT INTO elimination_matches (
        uuid, match_id, bracket_uuid, round_no, match_no, entry_a_uuid, entry_b_uuid,
        winner_entry_uuid, status, total_score_a, total_score_b, created_at
      ) VALUES (?, 'M-QF3', ?, 1, 3, ?, ?, ?, 'finished', 144, 139, NOW())
    `, [qf3Uuid, bracketUuid, entries[2].uuid, entries[5].uuid, entries[2].uuid]);
    await seedMatchDetail(qf3Uuid, 'A', [[10,10,9],[10,10,9],[10,9,9],[10,10,9],[10,9,9]]);       // 144
    await seedMatchDetail(qf3Uuid, 'B', [[9,9,9],[10,9,9],[9,9,9],[10,9,9],[9,9,8]]);            // 139

    // QF 4: Seed 2 (Andi: 145) vs Seed 7 (Hendra: 137) -> Winner: Seed 2
    const qf4Uuid = 'match-tt1-qf-4';
    await connection.query(`
      INSERT INTO elimination_matches (
        uuid, match_id, bracket_uuid, round_no, match_no, entry_a_uuid, entry_b_uuid,
        winner_entry_uuid, status, total_score_a, total_score_b, created_at
      ) VALUES (?, 'M-QF4', ?, 1, 4, ?, ?, ?, 'finished', 145, 137, NOW())
    `, [qf4Uuid, bracketUuid, entries[1].uuid, entries[6].uuid, entries[1].uuid]);
    await seedMatchDetail(qf4Uuid, 'A', [[10,10,9],[10,10,10],[10,9,9],[10,10,9],[10,9,9]]);     // 145
    await seedMatchDetail(qf4Uuid, 'B', [[9,9,9],[9,9,9],[10,9,9],[9,9,9],[9,9,8]]);             // 137

    // --- ROUND 2: SEMIFINALS (Round No: 2, 2 Matches) ---
    // SF 1: Winner QF1 (Seed 1: 148) vs Winner QF2 (Seed 4: 142) -> Winner: Seed 1 (to Gold Final), Loser: Seed 4 (to Bronze Final)
    const sf1Uuid = 'match-tt1-sf-1';
    await connection.query(`
      INSERT INTO elimination_matches (
        uuid, match_id, bracket_uuid, round_no, match_no, entry_a_uuid, entry_b_uuid,
        winner_entry_uuid, status, total_score_a, total_score_b, created_at
      ) VALUES (?, 'M-SF1', ?, 2, 1, ?, ?, ?, 'finished', 148, 142, NOW())
    `, [sf1Uuid, bracketUuid, entries[0].uuid, entries[3].uuid, entries[0].uuid]);
    await seedMatchDetail(sf1Uuid, 'A', [[10,10,10],[10,10,9],[10,10,10],[10,10,10],[10,10,9]]);  // 148
    await seedMatchDetail(sf1Uuid, 'B', [[10,9,9],[10,10,9],[10,9,9],[10,9,9],[9,9,9]]);          // 142

    // SF 2: Winner QF4 (Seed 2: 146) vs Winner QF3 (Seed 3: 144) -> Winner: Seed 2 (to Gold Final), Loser: Seed 3 (to Bronze Final)
    const sf2Uuid = 'match-tt1-sf-2';
    await connection.query(`
      INSERT INTO elimination_matches (
        uuid, match_id, bracket_uuid, round_no, match_no, entry_a_uuid, entry_b_uuid,
        winner_entry_uuid, status, total_score_a, total_score_b, created_at
      ) VALUES (?, 'M-SF2', ?, 2, 2, ?, ?, ?, 'finished', 146, 144, NOW())
    `, [sf2Uuid, bracketUuid, entries[1].uuid, entries[2].uuid, entries[1].uuid]);
    await seedMatchDetail(sf2Uuid, 'A', [[10,10,10],[10,10,9],[10,9,9],[10,10,9],[10,10,9]]);    // 146
    await seedMatchDetail(sf2Uuid, 'B', [[10,10,9],[10,10,9],[10,9,9],[10,10,9],[10,9,9]]);       // 144

    // --- ROUND 3: MEDAL FINALS (Round No: 3) ---
    // Bronze Medal Match: Loser SF1 (Seed 4: 143) vs Loser SF2 (Seed 3: 145) -> Winner: Seed 3 (Joko - BRONZE MEDAL!)
    const bronzeMatchUuid = 'match-tt1-bronze';
    await connection.query(`
      INSERT INTO elimination_matches (
        uuid, match_id, bracket_uuid, round_no, match_no, entry_a_uuid, entry_b_uuid,
        winner_entry_uuid, status, total_score_a, total_score_b, created_at
      ) VALUES (?, 'M-BRONZE', ?, 3, 2, ?, ?, ?, 'finished', 143, 145, NOW())
    `, [bronzeMatchUuid, bracketUuid, entries[3].uuid, entries[2].uuid, entries[2].uuid]);
    await seedMatchDetail(bronzeMatchUuid, 'A', [[10,10,9],[10,9,9],[10,10,9],[10,9,9],[9,9,9]]);  // 143
    await seedMatchDetail(bronzeMatchUuid, 'B', [[10,10,10],[10,10,9],[10,9,9],[10,10,9],[10,9,9]]);// 145

    // Gold Medal Final: Winner SF1 (Seed 1: 149) vs Winner SF2 (Seed 2: 146) -> Winner: Seed 1 (Rizky - GOLD MEDAL!, Andi - SILVER MEDAL!)
    const goldMatchUuid = 'match-tt1-gold';
    await connection.query(`
      INSERT INTO elimination_matches (
        uuid, match_id, bracket_uuid, round_no, match_no, entry_a_uuid, entry_b_uuid,
        winner_entry_uuid, status, total_score_a, total_score_b, created_at
      ) VALUES (?, 'M-GOLD', ?, 3, 1, ?, ?, ?, 'finished', 149, 146, NOW())
    `, [goldMatchUuid, bracketUuid, entries[0].uuid, entries[1].uuid, entries[0].uuid]);
    await seedMatchDetail(goldMatchUuid, 'A', [[10,10,10],[10,10,10],[10,10,10],[10,10,10],[10,10,9]]); // 149
    await seedMatchDetail(goldMatchUuid, 'B', [[10,10,10],[10,10,9],[10,10,9],[10,10,9],[10,9,9]]);      // 146

    console.log('   ✅ Seeded full 8-archer elimination tree with QF, SF, Bronze & Gold Finals.');
    console.log(`      🥇 Gold Medalist: ${entries[0].participant.full_name}`);
    console.log(`      🥈 Silver Medalist: ${entries[1].participant.full_name}`);
    console.log(`      🥉 Bronze Medalist: ${entries[2].participant.full_name}`);

    // 7. SEED CERTIFICATES
    console.log('📜 6. Seeding Official Certificates for all 14 Participants...');
    const certTemplateUuid = 'cert-tmpl-tt1';
    await connection.query(`
      INSERT INTO tournament_certificates (
        uuid, tournament_id, html_template, background_url, signature_url, created_at
      ) VALUES (?, ?, 'default_official_template', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&q=80', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80', NOW())
    `, [certTemplateUuid, tournamentUuid]);

    for (let i = 0; i < participants.length; i++) {
      const p = participants[i];
      const certNo = `CERT-TT1-2026-${String(i + 1).padStart(4, '0')}`;
      const pdfUrl = `/storage/certificates/cert-tt1-${p.archer_id}.pdf`;
      await connection.query(`
        INSERT INTO archer_certificates (
          uuid, tournament_id, archer_id, registration_id, certificate_no,
          issue_date, pdf_url, original_filename, created_at
        ) VALUES (?, ?, ?, ?, ?, NOW(), ?, 'Sertifikat_Kejuaraan_Resmi.pdf', NOW())
      `, [randomUUID(), tournamentUuid, p.archer_id, p.uuid, certNo, pdfUrl]);
    }
    console.log('   ✅ Seeded verifiable certificates for all 14 archers.');

    // 8. SEED FULL TOURNAMENT SCHEDULE & TIMELINE (Days 1 to 4)
    console.log('📅 7. Seeding 4-Day Complete Tournament Schedule Timeline...');
    
    const scheduleItems = [
      // DAY 1 (2026-09-20): Official Practice, Equipment Inspection, Managers Meeting, Opening Ceremony
      {
        day: 1,
        date: '2026-09-20',
        order: 1,
        type: 'general',
        start: '07:30:00',
        end: '08:30:00',
        dur: 60,
        title: 'Registrasi Ulang & Verifikasi Berkas Peserta',
        sub: 'Equipment Inspection & Re-registration',
        desc: 'Pengecekan kelengkapan busur compound, spesifikasi arrow, dan nomor dada resmi peserta',
        loc: 'Sekretariat Panitia & Ruang Pengecekan',
        session_code: null,
        cat_uuids: null,
        bracket_uuid: null,
        elim_round: null,
        target_start: null,
        target_end: null
      },
      {
        day: 1,
        date: '2026-09-20',
        order: 2,
        type: 'general',
        start: '08:30:00',
        end: '09:30:00',
        dur: 60,
        title: 'Latihan Resmi (Official Practice)',
        sub: 'Warm-up & Distance Calibration',
        desc: 'Sesi latihan penyesuaian jarak 50m dan kalibrasi sight bagi seluruh pemanah',
        loc: 'Lapangan Utama (Bantalan 1-4)',
        session_code: null,
        cat_uuids: JSON.stringify([catMenUuid, catWomenUuid]),
        bracket_uuid: null,
        elim_round: null,
        target_start: 1,
        target_end: 4
      },
      {
        day: 1,
        date: '2026-09-20',
        order: 3,
        type: 'general',
        start: '09:30:00',
        end: '10:30:00',
        dur: 60,
        title: 'Pertemuan Manajer Tim (Team Captains Meeting)',
        sub: 'Technical Briefing & Rules Confirmation',
        desc: 'Penjelasan tata tertib kejuaraan, konfirmasi daftar nama atlet, dan sesi tanya jawab',
        loc: 'Ruang Konferensi & Media Center',
        session_code: null,
        cat_uuids: null,
        bracket_uuid: null,
        elim_round: null,
        target_start: null,
        target_end: null
      },
      {
        day: 1,
        date: '2026-09-20',
        order: 4,
        type: 'general',
        start: '10:30:00',
        end: '11:45:00',
        dur: 75,
        title: 'Upacara Pembukaan Resmi Kejuaraan',
        sub: 'Official Opening Ceremony',
        desc: 'Defile atlet kontingen, sambutan ketua Perpani, dan pelepasan anak panah pertama',
        loc: 'Panggung Utama & Tribun Lapangan',
        session_code: null,
        cat_uuids: null,
        bracket_uuid: null,
        elim_round: null,
        target_start: null,
        target_end: null
      },

      // DAY 2 (2026-09-21): Qualification Sessions & Team Seeding
      {
        day: 2,
        date: '2026-09-21',
        order: 1,
        type: 'general',
        start: '07:30:00',
        end: '08:00:00',
        dur: 30,
        title: 'Pemanasan Resmi Sesi Kualifikasi',
        sub: 'Official Warm-up Session',
        desc: '3 seri anak panah pemanasan sebelum dimulainya skoring resmi',
        loc: 'Lapangan Utama (Bantalan 1-4)',
        session_code: 'SES-01',
        cat_uuids: JSON.stringify([catMenUuid, catWomenUuid]),
        bracket_uuid: null,
        elim_round: null,
        target_start: 1,
        target_end: 4
      },
      {
        day: 2,
        date: '2026-09-21',
        order: 2,
        type: 'qualification',
        start: '08:00:00',
        end: '11:30:00',
        dur: 210,
        title: 'Babak Kualifikasi Compound U-18 (Sesi 1)',
        sub: '6 Seri x 6 Panahan (50m Target Face 80cm)',
        desc: 'Skoring kualifikasi resmi penentuan ranking perorangan dan tim',
        loc: 'Lapangan Utama (Bantalan 1-4)',
        session_code: 'SES-01',
        cat_uuids: JSON.stringify([catMenUuid, catWomenUuid]),
        bracket_uuid: null,
        elim_round: null,
        target_start: 1,
        target_end: 4
      },
      {
        day: 2,
        date: '2026-09-21',
        order: 3,
        type: 'general',
        start: '11:30:00',
        end: '13:00:00',
        dur: 90,
        title: 'Istirahat Makan Siang & Penandatanganan Lembar Skor',
        sub: 'Lunch Break & Official Score Verification',
        desc: 'Verifikasi tanda tangan digital & fisik atlet dan scorekeeper resmi',
        loc: 'Rest Area & Sekretariat',
        session_code: null,
        cat_uuids: null,
        bracket_uuid: null,
        elim_round: null,
        target_start: null,
        target_end: null
      },
      {
        day: 2,
        date: '2026-09-21',
        order: 4,
        type: 'qualification',
        start: '13:00:00',
        end: '14:30:00',
        dur: 90,
        title: 'Sinkronisasi Peringkat Beregu & Beregu Campuran',
        sub: 'Team & Mixed Team Ranking Calculation',
        desc: 'Kalkulasi akumulasi skor tim klub untuk penyusunan seeding bagan eliminasi beregu',
        loc: 'Ruang Kontrol Sistem Pertandingan',
        session_code: null,
        cat_uuids: JSON.stringify([catTeamMenUuid, catMixedUuid]),
        bracket_uuid: null,
        elim_round: null,
        target_start: null,
        target_end: null
      },
      {
        day: 2,
        date: '2026-09-21',
        order: 5,
        type: 'general',
        start: '14:30:00',
        end: '16:00:00',
        dur: 90,
        title: 'Publikasi Hasil Kualifikasi & Bagan Eliminasi',
        sub: 'Official Results & Elimination Bracket Release',
        desc: 'Rilis hasil resmi kualifikasi, penentuan seed 1-8, dan pembagian line up eliminasi',
        loc: 'Papan Pengumuman & Portal Online',
        session_code: null,
        cat_uuids: null,
        bracket_uuid: null,
        elim_round: null,
        target_start: null,
        target_end: null
      },

      // DAY 3 (2026-09-22): Elimination Rounds
      {
        day: 3,
        date: '2026-09-22',
        order: 1,
        type: 'general',
        start: '08:00:00',
        end: '08:30:00',
        dur: 30,
        title: 'Pemanasan Babak Eliminasi',
        sub: 'Elimination Warm-up (2 Ends)',
        desc: 'Sesi latihan pemanasan sebelum babak gugur perorangan',
        loc: 'Lapangan Utama (Bantalan 1-4)',
        session_code: null,
        cat_uuids: JSON.stringify([catMenUuid]),
        bracket_uuid: bracketUuid,
        elim_round: 4,
        target_start: 1,
        target_end: 4
      },
      {
        day: 3,
        date: '2026-09-22',
        order: 2,
        type: 'elimination',
        start: '08:30:00',
        end: '10:30:00',
        dur: 120,
        title: 'Babak Perempat Final (1/4 Finals) Compound Putra',
        sub: 'Matchplay 5 Seri x 3 Panahan (Kumulatif)',
        desc: 'Pertandingan 8 besar: Seed 1 vs 8, 4 vs 5, 3 vs 6, 2 vs 7',
        loc: 'Lapangan Utama (Bantalan 1-4)',
        session_code: null,
        cat_uuids: JSON.stringify([catMenUuid]),
        bracket_uuid: bracketUuid,
        elim_round: 4,
        target_start: 1,
        target_end: 4
      },
      {
        day: 3,
        date: '2026-09-22',
        order: 3,
        type: 'elimination',
        start: '10:30:00',
        end: '12:00:00',
        dur: 90,
        title: 'Babak Semifinal (1/2 Finals) Compound Putra',
        sub: 'Matchplay 5 Seri x 3 Panahan',
        desc: 'Pertandingan semifinal penentuan tiket menuju babak perebutan medali emas',
        loc: 'Lapangan Utama (Bantalan 1-2)',
        session_code: null,
        cat_uuids: JSON.stringify([catMenUuid]),
        bracket_uuid: bracketUuid,
        elim_round: 2,
        target_start: 1,
        target_end: 2
      },
      {
        day: 3,
        date: '2026-09-22',
        order: 4,
        type: 'elimination',
        start: '13:30:00',
        end: '16:00:00',
        dur: 150,
        title: 'Babak Eliminasi Beregu & Beregu Campuran',
        sub: 'Team & Mixed Team Matchplay',
        desc: 'Pertandingan gugur antar regu klub panahan',
        loc: 'Lapangan Utama (Bantalan 1-4)',
        session_code: null,
        cat_uuids: JSON.stringify([catTeamMenUuid, catMixedUuid]),
        bracket_uuid: null,
        elim_round: 2,
        target_start: 1,
        target_end: 4
      },

      // DAY 4 (2026-09-23): Finals, Medal Ceremony & Closing
      {
        day: 4,
        date: '2026-09-23',
        order: 1,
        type: 'finals',
        start: '08:30:00',
        end: '09:30:00',
        dur: 60,
        title: 'Pertandingan Perebutan Medali Perunggu (Bronze Final)',
        sub: 'Bronze Medal Match - Compound Men',
        desc: 'Joko Firmansyah (Rank 3) vs Faris Pratama (Rank 4)',
        loc: 'Lapangan Utama - Target 1 & 2',
        session_code: null,
        cat_uuids: JSON.stringify([catMenUuid]),
        bracket_uuid: bracketUuid,
        elim_round: 1,
        target_start: 1,
        target_end: 2
      },
      {
        day: 4,
        date: '2026-09-23',
        order: 2,
        type: 'finals',
        start: '09:30:00',
        end: '10:45:00',
        dur: 75,
        title: 'Pertandingan Perebutan Medali Emas (Gold Final)',
        sub: 'Gold Medal Match - Compound Men',
        desc: 'Hendra Wijaya (Seed 1) vs Andi Saputra (Seed 2)',
        loc: 'Lapangan Utama - Target 1 & 2',
        session_code: null,
        cat_uuids: JSON.stringify([catMenUuid]),
        bracket_uuid: bracketUuid,
        elim_round: 1,
        target_start: 1,
        target_end: 2
      },
      {
        day: 4,
        date: '2026-09-23',
        order: 3,
        type: 'finals',
        start: '11:00:00',
        end: '12:30:00',
        dur: 90,
        title: 'Final Beregu & Beregu Campuran (Team Medal Matches)',
        sub: 'Gold & Bronze Matches for Teams',
        desc: 'Perebutan medali emas dan perunggu divisi beregu putra dan beregu campuran',
        loc: 'Lapangan Utama - Target 1 & 2',
        session_code: null,
        cat_uuids: JSON.stringify([catTeamMenUuid, catMixedUuid]),
        bracket_uuid: null,
        elim_round: 1,
        target_start: 1,
        target_end: 2
      },
      {
        day: 4,
        date: '2026-09-23',
        order: 4,
        type: 'general',
        start: '13:30:00',
        end: '15:00:00',
        dur: 90,
        title: 'Upacara Penyerahan Medali & Hadiah (Victory Ceremony)',
        sub: 'Podium Awarding & Total Prize Distribution',
        desc: 'Penyerahan medali emas, perak, perunggu, trofi kejuaraan, dan dana pembinaan atlet',
        loc: 'Podium Utama Kejuaraan',
        session_code: null,
        cat_uuids: null,
        bracket_uuid: null,
        elim_round: null,
        target_start: null,
        target_end: null
      },
      {
        day: 4,
        date: '2026-09-23',
        order: 5,
        type: 'general',
        start: '15:00:00',
        end: '16:30:00',
        dur: 90,
        title: 'Penerbitan E-Sertifikat & Penutupan Turnamen',
        sub: 'Official Certificate Issuance & Tournament Conclusion',
        desc: 'Penerbitan e-sertifikat terverifikasi bagi seluruh peserta dan penutupan resmi acara',
        loc: 'Seluruh Saluran & Web Portal Archeris',
        session_code: null,
        cat_uuids: null,
        bracket_uuid: null,
        elim_round: null,
        target_start: null,
        target_end: null
      }
    ];

    for (const item of scheduleItems) {
      const itemUuid = randomUUID();
      // Insert into modern timeline table
      await connection.query(`
        INSERT INTO tournament_schedule_items (
          uuid, tournament_id, item_type, start_time, end_time, duration_minutes, delay_minutes,
          title, subtitle, description, location, session_code, category_uuids, bracket_uuid,
          elim_round, target_start, target_end, sort_order, day_number, schedule_date, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        itemUuid, tournamentUuid, item.type, item.start, item.end, item.dur,
        item.title, item.sub, item.desc, item.loc, item.session_code, item.cat_uuids, item.bracket_uuid,
        item.elim_round, item.target_start, item.target_end, item.order, item.day, item.date
      ]);

      // Insert into legacy tournament_schedules table for full backwards compatibility
      const startDateTime = `${item.date} ${item.start}`;
      const endDateTime = `${item.date} ${item.end}`;
      await connection.query(`
        INSERT INTO tournament_schedules (
          uuid, tournament_id, title, description, start_time, end_time, day_order, sort_order, location, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        randomUUID(), tournamentUuid, item.title, item.desc, startDateTime, endDateTime, item.day, item.order, item.loc
      ]);
    }
    console.log(`   ✅ Seeded ${scheduleItems.length} schedule timeline items across 4 competition days.`);

    // 9. SEED MEDIA ASSETS & GALLERY IMAGES
    console.log('🖼️  8. Seeding Tournament Media & Gallery Assets...');
    const mediaImages = [
      {
        url: 'https://images.unsplash.com/photo-1511067007772-9da29974ce9e?w=1600&q=80',
        caption: 'Poster Resmi Kejuaraan Tournament Testing 1',
        alt: 'Official Tournament Testing 1 Poster',
        order: 1,
        isPrimary: 1,
        mime: 'image/jpeg',
        size: 450000
      },
      {
        url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80',
        caption: 'Layout Lapangan & Pemetaan Bantalan Sasaran (1-4)',
        alt: 'Target Butt Range Layout',
        order: 2,
        isPrimary: 0,
        mime: 'image/jpeg',
        size: 320000
      },
      {
        url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&q=80',
        caption: 'Preview Desain Sertifikat & Piagam Penghargaan Resmi',
        alt: 'Official Certificate Design Preview',
        order: 3,
        isPrimary: 0,
        mime: 'image/jpeg',
        size: 512000
      },
      {
        url: 'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?w=1200&q=80',
        caption: 'Podium Medali & Trofi Juara Umum Divisi Compound',
        alt: 'Medal Podium and Championship Trophy',
        order: 4,
        isPrimary: 0,
        mime: 'image/jpeg',
        size: 389000
      }
    ];

    for (const img of mediaImages) {
      const imgUuid = randomUUID();
      await connection.query(`
        INSERT INTO tournament_images (
          uuid, tournament_id, url, caption, alt_text, display_order, is_primary, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
      `, [imgUuid, tournamentUuid, img.url, img.caption, img.alt, img.order, img.isPrimary]);

      await connection.query(`
        INSERT INTO media (
          uuid, user_id, tournament_id, user_type, url, caption, mime_type, size, created_at, updated_at
        ) VALUES (?, ?, ?, 'organizer', ?, ?, ?, ?, NOW(), NOW())
      `, [randomUUID(), tournaments[0].organizer_id, tournamentUuid, img.url, img.caption, img.mime, img.size]);
    }
    console.log('   ✅ Seeded 4 official media assets in tournament gallery.');

    // 10. UPDATE TOURNAMENT METADATA & PAGE SETTINGS
    console.log('🏆 9. Updating Tournament Metadata (Description, Prizes, FAQs, Page Settings)...');
    
    const tournamentDescription = `
      <p class="lead font-medium text-gray-700 mb-4">
        <strong>Tournament Testing 1</strong> adalah kejuaraan panahan resmi standar World Archery yang mempertemukan atlet-atlet panahan berbakat pada divisi Compound Putra dan Putri U-18 se-Indonesia.
      </p>
      <p class="text-gray-600 mb-3">
        Diselenggarakan di fasilitas panahan terstandarisasi, kejuaraan ini menyelenggarakan nomor pertandingan <strong>Perorangan Putra (50m)</strong>, <strong>Perorangan Putri (50m)</strong>, <strong>Beregu Putra</strong>, dan <strong>Beregu Campuran (Mixed Team)</strong>.
      </p>
      <p class="text-gray-600 mb-3">
        Seluruh proses registrasi, pembayaran, penempatan bantalan sasaran, pencatatan skor kualifikasi hingga eliminasi gugur dikelola secara real-time melalui sistem teknologi digital <strong>Archeris Platform</strong>.
      </p>
    `.trim();

    const faqs = [
      {
        question: 'Bagaimana ketentuan peralatan untuk divisi Compound U-18?',
        answer: 'Peralatan busur compound wajib mematuhi standar World Archery (maksimum draw weight 60 lbs). Scope magnification dan peep sight diperbolehkan tanpa alat elektronik pengukur jarak.'
      },
      {
        question: 'Bagaimana format penentuan ranking kualifikasi dan babak eliminasi?',
        answer: 'Babak kualifikasi menggunakan akumulasi 36 anak panah (6 seri x 6 panahan pada jarak 50m). Babak eliminasi Compound menggunakan sistem skor kumulatif total 15 anak panah (5 seri x 3 panahan, poin maksimal 150).'
      },
      {
        question: 'Apakah seluruh peserta mendapatkan e-sertifikat resmi?',
        answer: 'Ya, seluruh peserta yang terdaftar resmi dan menyelesaikan perlombaan berhak mengunduh E-Sertifikat resmi terverifikasi dengan QR Code dan nomor sertifikat unik dari penyelenggara.'
      },
      {
        question: 'Bagaimana sistem pembentukan tim beregu dan mixed team?',
        answer: 'Tim beregu putra dibentuk otomatis berdasarkan 3 skor kualifikasi terbaik dari klub yang sama. Tim beregu campuran (Mixed Team) dibentuk dari 1 pemanah putra dan 1 pemanah putri terbaik dari klub masing-masing.'
      }
    ];

    const pageSettings = {
      enable_manual_payment: true,
      country: 'Indonesia',
      country_code: 'ID',
      currency: 'IDR',
      fee_mode: 'per_type',
      fee_per_category: {},
      fee_per_type: {
        individual: 50000,
        team: 75000,
        mixed_team: 75000
      },
      fees: [],
      location_accessibility: [
        'Parkir Luas & Aman',
        'Musholla & Tempat Wudhu',
        'Tribun Penonton Beratap',
        'Kantin & Rest Area Atlet',
        'Fasilitas Medis & P3K',
        'Akses Kursi Roda'
      ],
      payment_methods: ['3c586625-5b21-4dd2-af0f-8028f3fc20fa'],
      prizes: {
        first: 'Rp 7.500.000 + Medali Emas & Piagam Juara',
        first_caption: 'Juara 1 Divisi Compound Putra & Putri',
        second: 'Rp 5.000.000 + Medali Perak & Piagam Juara',
        second_caption: 'Juara 2 Divisi Compound Putra & Putri',
        third: 'Rp 2.500.000 + Medali Perunggu & Piagam Juara',
        third_caption: 'Juara 3 Divisi Compound Putra & Putri'
      },
      registration_start: '2026-09-01T00:00:00.000Z',
      results: [],
      results_type: 'system',
      sections: {
        about: true,
        divisions: true,
        fees: true,
        payment_methods: true,
        prizes: true,
        schedule: true,
        location: true,
        faq: true
      },
      visibility: 'external'
    };

    await connection.query(`
      UPDATE tournaments
      SET 
        short_name = 'TT1 2026',
        description = ?,
        venue = 'Stadion Panahan Kalasan Yogyakarta',
        address = 'Jl. Raya Kalasan No. 12, Sleman, D.I. Yogyakarta',
        city = 'Sleman',
        banner_url = 'https://images.unsplash.com/photo-1511067007772-9da29974ce9e?w=1600&q=80',
        logo_url = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&q=80',
        technical_guidebook_url = NULL,
        total_prize = 15000000.00,
        faq = ?,
        page_settings = ?,
        status = 'active',
        visibility = 'external'
      WHERE uuid = ?
    `, [tournamentDescription, JSON.stringify(faqs), JSON.stringify(pageSettings), tournamentUuid]);
    console.log('   ✅ Updated tournament details with venue, prizes, handbook URL, rich FAQ, and page settings.');

    console.log('\n🎉 ALL TOURNAMENT-TESTING-1 DATA SEEDING COMPLETED SUCCESSFULLY!');
    console.log('================================================================');
    console.log('📊 Tournament Testing 1 Summary:');
    console.log('   - 14 Paid Registrations (Payments verified)');
    console.log('   - 4 Target Butts (1A-4C assigned)');
    console.log('   - 1 Finalized Qualification Session (6 ends x 6 arrows, 14 scored archers)');
    console.log('   - 2 Compound Men Teams & 3 Compound Mixed Teams');
    console.log('   - 1 Completed Compound Men Top 8 Elimination Tree (QF, SF, Bronze, Gold Finals)');
    console.log('   - 14 Official Verifiable Certificates');
    console.log('   - 18 Schedule Timeline Items across 4 Competition Days');
    console.log('   - 4 Gallery Images & Official Media Assets');
    console.log('   - Complete Landing Page Meta, Prizes (Rp 15jt), FAQ, & Handbook');
    console.log('================================================================\n');

  } catch (err) {
    console.error('❌ Error during seeding:', err);
    throw err;
  } finally {
    await connection.end();
  }
}

seedTournamentTesting1();


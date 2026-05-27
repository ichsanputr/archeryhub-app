export const sistem_eliminasi = {
  slug: 'sistem-eliminasi', title: 'Elimination Match System', excerpt: 'Elimination bracket, tie mechanism, and additional end in match scoring mode.', icon: 'ph:git-branch-bold', category: 'scoring', readTime: '8 min',
  toc: [{ id: 'bracket', level: 2, text: 'Making Brackets' }, { id: 'generate-otomatis', level: 2, text: 'Automatic Generate' }, { id: 'skor-set', level: 2, text: 'Set Score System' }, { id: 'tie-mechanism', level: 2, text: 'Tie Mechanism (Series)' }, { id: 'additional-end', level: 2, text: 'Additional End in Dashboard' }],
  content: `
          <h2 id="bracket">Create Bracket</h2>
          <p>After qualifying is complete, the committee creates elimination brackets per category/division. Placement of participants can be done manually or automatically based on ranking.</p>
          <h2 id="generate-auto">Generate Auto</h2>
          <p>Generate mode automatically arranges seeding from qualification results. The system generally supports a large 32/16/8/4 format according to the number of qualifying participants.</p>
          <h2 id="score-set">Score Set System</h2>
          <p>For recurve elimination, a set system is used: winner of the set gets 2 points, draw 1-1, loser 0. The winner of the match is determined when the set point threshold is reached (generally 6).</p>
          <h2 id="tie-mechanism">Tie Mechanism</h2>
          <p>If the match score ends in a draw at the final threshold, the match goes into a tie-break mechanism. In field practice, the tie-break can be a shoot-off / additional end according to the event configuration and regulations.</p>
          <p>Important principle: the system must record tie-break results explicitly so that the winner bracket is not ambiguous and the scoring history remains audit-friendly.</p>
          <h2 id="additional-end">Additional End (Additional End)</h2>
          <p>In a situation where the match result remains a draw after all regular ends have been completed, the dashboard operator can add an <strong>Additional End</strong> as a winner.</p>
          <p>This feature can be accessed directly via the control button on the Scoring Match screen on the Organization Dashboard. Once additional end values ​​are input, the system will automatically determine the winner and update the bracket chart to the next round without the need for additional manual intervention.</p>
`
}

# Qualification Schema Migration Guide

## Overview
The qualification system has been completely restructured to support proper target assignments and arrow-level scoring.

## Database Schema Changes

### New Tables

#### 1. **qualification_sessions**
Manages scoring sessions for each category.
```sql
- uuid (VARCHAR(36) PK)
- event_uuid (VARCHAR(36))
- category_uuid (VARCHAR(36))
- name (VARCHAR(255))
- start_time (DATETIME)
- end_time (DATETIME)
- total_ends (INT) - default 12
- arrows_per_end (INT) - default 6
- status (ENUM: 'draft', 'active', 'completed')
```

#### 2. **qualification_target_assignments**
Links archers to physical targets (replaces old `qualification_assignments`).
```sql
- uuid (VARCHAR(36) PK)
- session_uuid (VARCHAR(36) FK)
- archer_uuid (VARCHAR(36) FK)
- target_uuid (VARCHAR(36) FK) - references event_targets.uuid
- target_position (VARCHAR(1)) - A, B, C, D
```

#### 3. **qualification_end_scores**
Stores aggregated scores per end (replaces individual arrow columns).
```sql
- uuid (VARCHAR(36) PK)
- session_uuid (VARCHAR(36) FK)
- archer_uuid (VARCHAR(36) FK)
- end_number (INT)
- total_score_end (INT)
- x_count_end (INT)
- ten_count_end (INT)
- is_confirmed (BOOLEAN)
```

#### 4. **qualification_arrow_scores**
Stores individual arrow scores.
```sql
- uuid (VARCHAR(36) PK)
- end_score_uuid (VARCHAR(36) FK)
- arrow_number (INT) - 1 to 6
- score (INT) - 0 to 10
- is_x (BOOLEAN)
```

#### 5. **event_targets**
Master data for physical targets.
```sql
- uuid (VARCHAR(36) PK)
- event_uuid (VARCHAR(36) FK)
- target_number (INT) - e.g., 1, 2, 3
- target_name (VARCHAR(255))
- description (TEXT)
- venue_area (VARCHAR(255))
- capacity (INT) - default 4 (A, B, C, D)
- status (ENUM: 'active', 'inactive', 'maintenance')
```

### Removed Tables
- `qualification_assignments` (replaced by `qualification_target_assignments`)
- `matches`, `match_participants`, `match_end_scores`, `match_target_assignments`
- Entire elimination phase removed

### Removed Files
- `api/handler/scoring.go` (merged into qualification.go)
- `api/handler/session_official.go` (completely removed)
- `api/handler/club_membership.go` (merged into club.go)
- `api/handler/archer_profile_image.go` (merged into archer.go)

## API Endpoint Changes

### New Endpoints

#### Event Targets (Master Data)
```
GET    /api/v1/events/:id/targets
POST   /api/v1/events/:id/targets
GET    /api/v1/events/:id/targets/:targetId
PUT    /api/v1/events/:id/targets/:targetId
DELETE /api/v1/events/:id/targets/:targetId
```

#### Qualification Sessions
```
GET  /api/v1/categories/:categoryId/qualification/sessions
POST /api/v1/categories/:categoryId/qualification/sessions
```

#### Target Assignments
```
GET    /api/v1/qualification/sessions/:sessionId/assignments
POST   /api/v1/qualification/sessions/:sessionId/auto-assign
DELETE /api/v1/qualification/assignments/:assignmentId
```

#### Scoring
```
GET  /api/v1/qualification/assignments/:assignmentId/scores
POST /api/v1/qualification/assignments/:assignmentId/scores
```

#### Leaderboard
```
GET /api/v1/qualification/sessions/:sessionId/leaderboard
```

### Removed Endpoints
```
GET /api/v1/events/:id/back-numbers
PUT /api/v1/participants/:participantId/assignment
```

## Frontend Migration Guide

### Component Updates Required

#### 1. **AssignmentManager.vue**
- ✅ Updated to use new `qualification_target_assignments` structure
- Target grouping now uses `target_name` instead of `target_number`
- Assignment UUID properly mapped

#### 2. **ScoringInput.vue**
- ✅ Updated to send/receive arrows as array instead of individual fields
- API now expects: `{ end_number: 1, arrows: ['X', '10', '9', 'M', '8', '7'] }`
- Fetched scores include `arrows` array with proper mapping

#### 3. **Event Overview Pages**
- ⚠️ **NEEDS UPDATE**: Participants no longer have `target_number` field
- Target assignments are now separate query via `/qualification/sessions/:sessionId/assignments`
- Need to join participant data with assignment data

### Data Structure Changes

#### Old Participant Structure
```javascript
{
  uuid: "...",
  full_name: "John Doe",
  target_number: 12,  // ❌ No longer exists
  target_position: "A",  // ❌ No longer on participant
  qualification_score: 650
}
```

#### New Structure (Separate Queries)
```javascript
// Participant
{
  uuid: "...",
  full_name: "John Doe",
  // No target info here
}

// Target Assignment (separate query)
{
  uuid: "assignment-uuid",
  archer_uuid: "...",
  target_uuid: "target-uuid",
  target_number: 12,  // From joined event_targets
  target_name: "Target 12",
  target_position: "A",
  // Plus joined archer info
  archer_name: "John Doe"
}
```

#### Score Structure
```javascript
// Old (per end)
{
  end_number: 1,
  arrow_1: "X",
  arrow_2: "10",
  arrow_3: "9",
  arrow_4: "8",
  arrow_5: "7",
  arrow_6: "M",
  end_total: 44,
  end_x_count: 1,
  end_10_count: 2
}

// New (with arrow details)
{
  uuid: "...",
  end_number: 1,
  total_score_end: 44,
  x_count_end: 1,
  ten_count_end: 2,
  is_confirmed: false,
  arrows: [
    { arrow_number: 1, score: 10, is_x: true },
    { arrow_number: 2, score: 10, is_x: false },
    { arrow_number: 3, score: 9, is_x: false },
    { arrow_number: 4, score: 8, is_x: false },
    { arrow_number: 5, score: 7, is_x: false },
    { arrow_number: 6, score: 0, is_x: false }
  ]
}
```

## Migration Steps for Existing Data

If you have existing participants with `target_number` field, you need to:

1. **Create event_targets** for each unique target number
```sql
INSERT INTO event_targets (uuid, event_uuid, target_number, target_name, capacity, status)
SELECT 
  UUID() as uuid,
  event_id,
  DISTINCT target_number,
  CONCAT('Target ', target_number) as target_name,
  4 as capacity,
  'active' as status
FROM participants
WHERE target_number IS NOT NULL
GROUP BY event_id, target_number;
```

2. **Create qualification_session** for each category
```sql
INSERT INTO qualification_sessions (uuid, event_uuid, category_uuid, name, total_ends, arrows_per_end, status)
SELECT 
  UUID() as uuid,
  ec.event_id,
  ec.uuid as category_uuid,
  CONCAT(ec.category_name, ' - Qualification') as name,
  12 as total_ends,
  6 as arrows_per_end,
  'active' as status
FROM event_categories ec;
```

3. **Migrate target assignments**
```sql
INSERT INTO qualification_target_assignments (uuid, session_uuid, archer_uuid, target_uuid, target_position)
SELECT 
  UUID() as uuid,
  qs.uuid as session_uuid,
  p.archer_id as archer_uuid,
  et.uuid as target_uuid,
  COALESCE(p.target_position, 'A') as target_position
FROM participants p
JOIN event_categories ec ON p.category_id = ec.uuid
JOIN qualification_sessions qs ON qs.category_uuid = ec.uuid
JOIN event_targets et ON et.event_uuid = p.event_id AND et.target_number = p.target_number
WHERE p.target_number IS NOT NULL;
```

4. **Drop old columns** (after migration verified)
```sql
ALTER TABLE participants DROP COLUMN target_number;
ALTER TABLE participants DROP COLUMN target_position;
```

## Testing Checklist

- [ ] Create new event and add targets via `/events/:id/targets`
- [ ] Create qualification session via `/categories/:id/qualification/sessions`
- [ ] Auto-assign participants to targets
- [ ] Input scores using new arrow array format
- [ ] Verify leaderboard displays correctly
- [ ] Confirm arrow-level details are saved
- [ ] Test target capacity validation
- [ ] Verify cascade deletes work (delete participant → deletes assignments & scores)

## Compatibility Notes

- The new structure is **NOT backward compatible** with old qualification_assignments
- Frontend components **must** be updated to use separate queries for assignments
- Scoring UI should handle both old format (for editing) and new format (for saving)
- Event overview/dashboard needs refactoring to fetch assignments separately

## Benefits of New Structure

1. **Proper Target Management**: Physical targets are master data, reusable across events
2. **Arrow-Level Tracking**: Can review individual arrow scores, detect patterns
3. **Better Scalability**: Sessions can be created dynamically, multiple sessions per category
4. **Audit Trail**: Each end score and arrow has UUID for tracking changes
5. **Flexible Positions**: Support for different target capacities (3, 4, 5, 6 archers per target)
6. **Cleaner Schema**: Normalized structure, no more `arrow_1` through `arrow_6` columns

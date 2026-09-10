-- Optional. The live game now also stores the current round on a hidden
-- player row if this column is missing.
alter table rooms
  add column if not exists question_index integer not null default 0;

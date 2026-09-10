-- Current question number for a live room. Safe to re-run.
alter table rooms
  add column if not exists question_index integer not null default 0;

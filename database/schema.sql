create extension if not exists pgcrypto;

create table if not exists experiment_seeds (
    id uuid primary key default gen_random_uuid(),
    seed_key text not null unique,
    prompt_text text not null,
    category text,
    config jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);

create table if not exists experiment_runs (
    id uuid primary key default gen_random_uuid(),
    seed_id uuid not null references experiment_seeds(id),
    provider text not null,
    model text not null,
    repeat_index integer not null default 0,
    scheduled_for timestamptz,
    started_at timestamptz,
    completed_at timestamptz,
    status text not null check (status in ('pending','running','succeeded','failed')),
    request_config jsonb not null default '{}'::jsonb,
    prompt_version text,
    schema_version text,
    request_fingerprint text,
    source_refs jsonb not null default '[]'::jsonb,
    error_code text,
    error_message text,
    created_at timestamptz not null default now()
);

create table if not exists model_outputs (
    id uuid primary key default gen_random_uuid(),
    run_id uuid not null unique references experiment_runs(id),
    output_text text not null,
    latency_ms integer,
    input_tokens integer,
    output_tokens integer,
    provider_request_id text,
    provider_metadata jsonb not null default '{}'::jsonb,
    output_hash text,
    estimated_cost_usd numeric(14,8),
    created_at timestamptz not null default now()
);

create table if not exists evaluations (
    id uuid primary key default gen_random_uuid(),
    run_id uuid not null references experiment_runs(id),
    evaluator_name text not null,
    evaluator_version text,
    rubric_version text,
    scores jsonb not null default '{}'::jsonb,
    narrative text,
    raw_output jsonb,
    created_at timestamptz not null default now()
);

create index if not exists idx_runs_seed_id on experiment_runs(seed_id);
create index if not exists idx_runs_provider_model on experiment_runs(provider, model);
create index if not exists idx_runs_started_at on experiment_runs(started_at);
create index if not exists idx_evaluations_run_id on evaluations(run_id);

create index if not exists idx_runs_request_fingerprint on experiment_runs(request_fingerprint);

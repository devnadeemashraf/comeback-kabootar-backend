# Job Dispatch Process

Cross-feature workflow: run job → dispatch emails → track delivery → deduct credits → notify user.

Orchestration only; all data access via feature/entity contracts (repositories, gateways). No inline DB queries.

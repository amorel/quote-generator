#!/bin/bash

# Backup MongoDB
docker exec mongodb mongodump --out /backup/$(date +%Y%m%d)

# Backup PostgreSQL
docker exec postgres pg_dump -U postgres database > /backup/postgres_$(date +%Y%m%d).sql

# Compress backups
tar -czf /backup/backup_$(date +%Y%m%d).tar.gz /backup/$(date +%Y%m%d)

# Upload to S3 or autre stockage distant
aws s3 cp /backup/backup_$(date +%Y%m%d).tar.gz s3://your-bucket/
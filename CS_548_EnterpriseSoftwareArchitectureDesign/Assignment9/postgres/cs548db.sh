set -e
psql -v ON_ERROR_STOP=1  -v password="XXXXXX"  --username "postgres"  --dbname "postgres" <<-EOSQL
	CREATE USER cs548user WITH PASSWORD 'YYYYYY';
	CREATE DATABASE cs548 WITH OWNER cs548user;
	GRANT ALL PRIVILEGES ON DATABASE cs548 TO cs548user;
EOSQL

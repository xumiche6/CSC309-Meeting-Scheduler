MANAGE_PY=manage.py
PYTHON=python

-include $(wildcard .env)


check_env_file:
	@if [ ! -f .env ]; then \
		echo "env file not found, unable to run prod commands"; \
		false; \
	fi

check_venv:
ifndef VIRTUAL_ENV
	$(error Please activate the virtual environment before running make commands)
endif

check_email:
ifndef EMAIL_HOST_PASSWORD
	$(error EMAIL_HOST_PASSWORD is not set, please set it in .env file, platform will run but email functionality will not work)
endif

makemigrations: check_venv
	$(PYTHON) $(MANAGE_PY) makemigrations

migrate: check_venv makemigrations
	$(PYTHON) $(MANAGE_PY) migrate

run: check_venv
	$(PYTHON) $(MANAGE_PY) runserver

dump: check_venv
	@$(PYTHON) $(MANAGE_PY) dumpdata --exclude contenttypes --exclude auth.permission --indent 2 > $(or $(FILENAME),test_data/initial_data.json)

load: check_venv
	@$(PYTHON) $(MANAGE_PY) loaddata $(or $(FILENAME),test_data/initial_data.json)

clear: check_venv
	$(PYTHON) $(MANAGE_PY) flush

prod_migrate: check_env_file
	gcloud run jobs execute migrate --region $(REGION) --wait

prod_build: check_env_file
	gcloud builds submit --pack image=${ARTIFACT_REGISTRY}/myimage

prod_deploy: prod_build check_env_file
	gcloud run deploy django-cloudrun \
  --region $(REGION) \
  --image $(ARTIFACT_REGISTRY)/myimage \
  --set-cloudsql-instances $(PROJECT_ID):$(REGION):myinstance \
  --set-secrets APPLICATION_SETTINGS=application_settings:latest \
  --set-secrets EMAIL_HOST_PASSWORD=email_host_password:latest \
  --service-account $(SERVICE_ACCOUNT) \
  --allow-unauthenticated

prod_load_data: check_env_file
	gcloud run jobs execute loaddata --region $(REGION) --wait
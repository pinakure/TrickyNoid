from pathlib import Path
import os
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get('DJANGO_SECRET')

DEBUG = True

ALLOWED_HOSTS = [
    'api.trickynoid.iskarion.ddns.net',
    'trickynoid.iskarion.ddns.net',
]

CSRF_TRUSTED_DOMAINS = [
    'https://trickynoid.iskarion.ddns.net',
    'https://api.trickynoid.iskarion.ddns.net',
]

INSTALLED_APPS = [
    # Required for KeyCloak
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.openid_connect',
    # ---------------------------
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
USE_X_FORWARDED_HOST = True
SOCIALACCOUNT_LOGIN_ON_GET = True
SITE_ID = 2

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

ROOT_URLCONF = 'game.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'game.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST'),
        'PORT': '5432',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    { 'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
    { 'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
    { 'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
    { 'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATIC_ROOT = '/static/trickynoid/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
LOGIN_REDIRECT_URL = "/"
LOGOUT_REDIRECT_URL = "/"

SOCIALACCOUNT_PROVIDERS = {
    "openid_connect": {
        "APPS": [
            {
                "provider_id"   : "keycloak",                       # Identificador interno
                "name"          : "Keycloak",                       # Nombre visible en botones
                "client_id"     : "trickynoid",                     # Tu ID de cliente en Keycloak
                "secret"        : os.environ.get('KC_SECRET'),
                "settings"      : {
                    "server_url": "https://auth.iskarion.ddns.net/realms/Iskarion/.well-known/openid-configuration",
                },
            }
        ],
        "AUTH_PARAMS": {
            "prompt": "login"
        }
    },
}

FROM python:3.12-slim

# Evita que Python escriba archivos .pyc y almacene en búfer de salida
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Crear el usuario y grupo 'melodify'
RUN groupadd -r trickynoid && useradd -r -g trickynoid trickynoid

WORKDIR /src/trickynoid/

# Instalar dependencias como root
COPY requirements.txt /src/trickynoid/

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /src/trickynoid/requirements.txt

# Crear estructura necesaria
RUN mkdir -p \
    /static/trickynoid \
    /media/trickynoid 

# Copiar proyecto directamente con ownership correcto
COPY --chown=trickynoid:trickynoid . /src/trickynoid

# Cambiar a usuario no-root
#USER trickynoid

# Ejecutar migraciones, recopilar estáticos y arrancar Gunicorn
CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && python manage.py collectstatic --noinput && gunicorn game.wsgi:application --bind 0.0.0.0:8000"]

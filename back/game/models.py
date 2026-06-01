from allauth.account.signals import user_logged_in
from django.dispatch import receiver

@receiver(user_logged_in)
def set_superuser_from_keycloak(sender, request, user, **kwargs):
    # Accede a los datos del token de Keycloak
    sociallogin = kwargs.get('sociallogin')
    if sociallogin:
        # Extrae los roles del token (ajusta la clave según tu configuración de Keycloak)
        roles = sociallogin.account.extra_data.get('resource_access', {}).get('tu-cliente-id', {}).get('roles', [])
        
        if 'superuser' in roles:
            user.is_superuser = True
            user.is_staff = True
            user.save()

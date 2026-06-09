# VetCare - Sistema de Gestión Veterinaria

App web para gestión veterinaria con React + Supabase.

## Estructura

```
vetcare-app/
├── index.html          # HTML principal - carga todos los módulos
├── css/
│   └── styles.css      # Estilos globales, animaciones, form elements
└── js/
    ├── config.js       # Supabase config, KEYS, mappers, API helpers
    ├── data.js         # BREEDS y SEED data inicial
    ├── utils.js        # Funciones puras: fullName, fmtDate, calcAge, byId...
    ├── palette.js      # Paleta de colores + buildCss dinámico
    ├── components.js   # Componentes primitivos: Btn, Card, Field, Modal...
    ├── layout.js       # Shell (nav), AuthScreen
    ├── admin.js        # AdminUsersPanel, EditUserModal, BlockedPanel
    ├── calendar.js     # CalendarView, solicitudes, citas
    ├── carnet.js       # PetCarnet, CarnetModal
    ├── dashboard.js    # Dashboard, PatientsList, RecordsList, MyPets, OwnerHistory
    ├── forms.js        # PetForm, RecordForm, ApptForm, TreatmentItemsField
    └── app.js          # App principal, handlers, estado global
```

## Credenciales demo

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@vetcare.com | admin2025 |
| Veterinario | german@clinica.com | vetcare2025 |
| Dueño | carlos@mail.com | 1234 |

## Deploy

Subir todos los archivos a Netlify (drag & drop de la carpeta) o GitHub Pages.

# Proyecto: Gestor de Finanzas Personales

Este proyecto es una API para la gestión de finanzas personales, que permite a los usuarios registrar presupuestos mensuales, clasificar sus transacciones en categorías de ingresos y gastos, gestionar metas de ahorro, y generar reportes financieros personalizados.

El backend de la API está construido con **Express** y utiliza **MySQL** como base de datos relacional.

## Tabla de Contenidos
1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Estructura de la Base de Datos](#estructura-de-la-base-de-datos)
3. [Lógica del Presupuesto](#lógica-del-presupuesto)
4. [Variables de Entorno](#variables-de-entorno)
5. [Instalación y Configuración](#instalación-y-configuración)

---

## Descripción del Proyecto

El **Gestor de Finanzas Personales** tiene como objetivo permitir a los usuarios llevar un control detallado de sus finanzas, organizando sus ingresos y gastos mensuales en un presupuesto, definiendo metas de ahorro y clasificando transacciones por categorías. Todo esto se hace bajo el concepto de diferentes monedas, y se ofrece flexibilidad para que los usuarios gestionen sus finanzas en la moneda de su preferencia.

Actualmente, el proyecto está en desarrollo, por lo que las rutas de la API aún no están documentadas en este archivo.

## Estructura de la Base de Datos

La base de datos relacional está diseñada en **MySQL** con un enfoque normalizado para garantizar la consistencia de los datos. El diagrama entidad-relación (ER) del proyecto se encuentra en la raíz del repositorio.

![ER](https://raw.githubusercontent.com/Oliverla977/api-finanzas-personales/c19e3e17b7d0c431d241fc09b0d0dc47024fb8d1/ER.svg "ER")

A continuación se describe brevemente el modelo de base de datos:

- **monedas**: Define las monedas disponibles (código ISO, símbolo, y nombre).
- **usuarios**: Almacena los datos de los usuarios (nombre, correo, moneda preferida, etc.).
- **presupuestos**: Cada presupuesto mensual del usuario, con su respectiva moneda.
- **categorías**: Categorías de ingresos y gastos personalizadas por el usuario.
- **presupuesto_categorías**: Relación entre un presupuesto y las categorías incluidas en él.
- **transacciones**: Registros de ingresos o gastos asociados a un presupuesto y categoría.
- **metas_ahorro**: Objetivos de ahorro definidos por el usuario.
- **ahorros_transacciones**: Registros de transacciones vinculadas a una meta de ahorro.

## Lógica del Presupuesto

El sistema permite a los usuarios crear presupuestos mensuales que están divididos en **categorías de ingresos y gastos**. Cada categoría puede tener un **monto presupuestado** al asignarse a un prespuesto, lo que permite a los usuarios visualizar cuánto desean gastar o ganar en cada área.

1. **Creación del presupuesto**:
   - Los usuarios crean un presupuesto mensual, definiendo el monto total y las categorías que desean gestionar.
   
2. **Asociación de categorías**:
   - Los usuarios pueden asignar categorías de ingresos y gastos a su presupuesto. Esto les permite organizar sus transacciones dentro del mes y ver claramente cómo se distribuye su dinero.

3. **Registro de transacciones**:
   - Los usuarios registran transacciones (ingresos o gastos) y las clasifican en las categorías correspondientes.
   
4. **Monitoreo y reportes**:
   - A medida que los usuarios registran transacciones, pueden ver el estado de su presupuesto, comparando los montos presupuestados con los montos reales de las transacciones. Esto les ayuda a controlar su gasto y tomar decisiones financieras más informadas.

En el caso de cambiar de moneda a lo largo del tiempo, los presupuestos y transacciones antiguos mantendrán la moneda original con la que fueron registrados, para garantizar la coherencia de los datos históricos.

## Variables de Entorno

Para configurar la conexión con la base de datos, es necesario establecer las siguientes variables de entorno:

- `DB_HOST`: El host donde está ubicada la base de datos.
- `DB_USER`: El nombre de usuario para conectarse a la base de datos.
- `DB_PASSWORD`: La contraseña del usuario para la base de datos.
- `DB_NAME`: El nombre de la base de datos (por defecto: `finanzas_personales`).
- `DB_PORT`: El puerto de conexión a la base de datos.

Asegúrate de configurar estas variables en un archivo `.env` en el directorio raíz del proyecto.

## Instalación y Configuración

### Prerrequisitos

- Node.js
- MySQL

### Pasos de instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Oliverla977/api-finanzas-personales.git
   cd api-finanzas-personales
   
2. Instala las dependencias del proyecto:
    ```bash
    npm install
    
3. Configura las variables de entorno en un archivo .env en la raíz del proyecto:
    ```bash
    DB_HOST=host
    DB_USER=tu_usuario
    DB_PASSWORD=tu_contraseña
    DB_NAME=finanzas_personales
    DB_PORT=3306

4. Inicia el servidor de desarrollo:
    ```bash
    npm run dev

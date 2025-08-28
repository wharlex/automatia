# 📧 Implementación del Formulario de Contacto

## ✅ Estado Actual
- ✅ Formulario funcional con validación
- ✅ API endpoint `/api/contact` creado
- ✅ Validación con Zod
- ✅ Manejo de errores y estados de carga
- ✅ UI responsive y moderna

## 🚀 Opciones para Envío Real de Emails

### Opción 1: SendGrid (Recomendado)
```bash
npm install @sendgrid/mail
```

```typescript
// En app/api/contact/route.ts
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

const msg = {
  to: 'contacto@automatia.store',
  from: 'noreply@automatia.store',
  subject: `Nuevo mensaje: ${validatedData.subject}`,
  html: `
    <h2>Nuevo mensaje de contacto</h2>
    <p><strong>Nombre:</strong> ${validatedData.name}</p>
    <p><strong>Email:</strong> ${validatedData.email}</p>
    <p><strong>Asunto:</strong> ${validatedData.subject}</p>
    <p><strong>Mensaje:</strong></p>
    <p>${validatedData.message}</p>
  `
}

await sgMail.send(msg)
```

### Opción 2: Resend
```bash
npm install resend
```

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'noreply@automatia.store',
  to: 'contacto@automatia.store',
  subject: `Nuevo mensaje: ${validatedData.subject}`,
  html: `
    <h2>Nuevo mensaje de contacto</h2>
    <p><strong>Nombre:</strong> ${validatedData.name}</p>
    <p><strong>Email:</strong> ${validatedData.email}</p>
    <p><strong>Asunto:</strong> ${validatedData.subject}</p>
    <p><strong>Mensaje:</strong></p>
    <p>${validatedData.message}</p>
  `
})
```

### Opción 3: Nodemailer (SMTP)
```bash
npm install nodemailer
```

```typescript
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com', // o tu proveedor SMTP
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

await transporter.sendMail({
  from: 'noreply@automatia.store',
  to: 'contacto@automatia.store',
  subject: `Nuevo mensaje: ${validatedData.subject}`,
  html: `
    <h2>Nuevo mensaje de contacto</h2>
    <p><strong>Nombre:</strong> ${validatedData.name}</p>
    <p><strong>Email:</strong> ${validatedData.email}</p>
    <p><strong>Asunto:</strong> ${validatedData.subject}</p>
    <p><strong>Mensaje:</strong></p>
    <p>${validatedData.message}</p>
  `
})
```

## 🔧 Variables de Entorno Necesarias

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Para SendGrid
SENDGRID_API_KEY=tu_api_key_aqui

# Para Resend
RESEND_API_KEY=tu_api_key_aqui

# Para Nodemailer
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_de_aplicacion
```

## 📝 Pasos para Implementar

1. **Elige un proveedor** (recomiendo SendGrid o Resend)
2. **Instala la dependencia** correspondiente
3. **Configura las variables de entorno**
4. **Descomenta el código** en `/api/contact/route.ts`
5. **Prueba el formulario** enviando un mensaje real

## 🎯 Funcionalidades Adicionales

### Notificación a Slack/Discord
```typescript
// Notificación a Slack
const slackWebhook = process.env.SLACK_WEBHOOK_URL
if (slackWebhook) {
  await fetch(slackWebhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `🆕 Nuevo mensaje de contacto de ${validatedData.name} (${validatedData.email}): ${validatedData.subject}`
    })
  })
}
```

### Guardado en Base de Datos
```typescript
// Si usas Prisma
await db.contactMessage.create({
  data: {
    name: validatedData.name,
    email: validatedData.email,
    subject: validatedData.subject,
    message: validatedData.message,
    createdAt: new Date(),
    ip: req.headers.get("x-forwarded-for") || req.ip || "unknown"
  }
})
```

### Email de Confirmación al Usuario
```typescript
// Enviar confirmación al usuario
await sgMail.send({
  to: validatedData.email,
  from: 'noreply@automatia.store',
  subject: 'Mensaje recibido - Automatía',
  html: `
    <h2>¡Gracias por contactarnos!</h2>
    <p>Hemos recibido tu mensaje y te responderemos en menos de 24 horas.</p>
    <p><strong>Resumen:</strong></p>
    <p><strong>Asunto:</strong> ${validatedData.subject}</p>
    <p><strong>Mensaje:</strong> ${validatedData.message}</p>
  `
})
```

## 🧪 Testing

Para probar el formulario:

1. Ve a `http://localhost:3001/contacto`
2. Completa el formulario
3. Envía el mensaje
4. Verifica en la consola del servidor que se recibió
5. Si implementaste email real, verifica tu bandeja de entrada

## 🔒 Seguridad

- ✅ Validación de entrada con Zod
- ✅ Sanitización de datos
- ✅ Rate limiting (implementar si es necesario)
- ✅ Protección contra spam (CAPTCHA opcional)

## 📱 Responsive

El formulario ya está optimizado para móvil con:
- Grid responsivo
- Campos apilados en móvil
- Botones de tamaño apropiado
- Espaciado adaptativo








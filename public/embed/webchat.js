/**
 * Automatía Webchat Widget
 * Widget embebido para integrar chatbots en sitios web
 */

(function() {
  'use strict';

  // Configuración por defecto
  const defaultConfig = {
    theme: 'dark',
    position: 'bottom-right',
    primaryColor: '#FFD700',
    textColor: '#FFFFFF',
    backgroundColor: '#1a365d',
    borderRadius: '12px',
    width: '350px',
    height: '500px',
    zIndex: 9999
  };

  class AutomatiaWebchat {
    constructor(config = {}) {
      this.config = { ...defaultConfig, ...config };
      this.isOpen = false;
      this.messages = [];
      this.externalUserId = this.generateUserId();
      this.init();
    }

    init() {
      this.createStyles();
      this.createWidget();
      this.bindEvents();
      this.loadMessages();
    }

    createStyles() {
      const style = document.createElement('style');
      style.textContent = `
        .automatia-webchat-widget {
          position: fixed;
          ${this.config.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
          ${this.config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
          z-index: ${this.config.zIndex};
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .automatia-webchat-toggle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: ${this.config.primaryColor};
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          font-size: 24px;
        }

        .automatia-webchat-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }

        .automatia-webchat-container {
          position: absolute;
          ${this.config.position.includes('bottom') ? 'bottom: 80px;' : 'top: 80px;'}
          ${this.config.position.includes('right') ? 'right: 0;' : 'left: 0;'}
          width: ${this.config.width};
          height: ${this.config.height};
          background: ${this.config.backgroundColor};
          border-radius: ${this.config.borderRadius};
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          display: none;
          flex-direction: column;
          overflow: hidden;
        }

        .automatia-webchat-header {
          background: ${this.config.primaryColor};
          color: #000;
          padding: 16px;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .automatia-webchat-close {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #000;
        }

        .automatia-webchat-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .automatia-message {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 18px;
          word-wrap: break-word;
        }

        .automatia-message.user {
          background: ${this.config.primaryColor};
          color: #000;
          align-self: flex-end;
          border-bottom-right-radius: 4px;
        }

        .automatia-message.bot {
          background: rgba(255,255,255,0.1);
          color: ${this.config.textColor};
          align-self: flex-start;
          border-bottom-left-radius: 4px;
        }

        .automatia-webchat-input {
          padding: 16px;
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex;
          gap: 8px;
        }

        .automatia-webchat-input input {
          flex: 1;
          padding: 12px 16px;
          border: none;
          border-radius: 20px;
          background: rgba(255,255,255,0.1);
          color: ${this.config.textColor};
          outline: none;
        }

        .automatia-webchat-input input::placeholder {
          color: rgba(255,255,255,0.6);
        }

        .automatia-webchat-input button {
          padding: 12px 20px;
          border: none;
          border-radius: 20px;
          background: ${this.config.primaryColor};
          color: #000;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .automatia-webchat-input button:hover {
          transform: scale(1.05);
        }

        .automatia-webchat-input button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .automatia-typing {
          display: none;
          align-self: flex-start;
          padding: 12px 16px;
          background: rgba(255,255,255,0.1);
          border-radius: 18px;
          color: ${this.config.textColor};
          font-style: italic;
        }

        .automatia-typing.show {
          display: block;
        }
      `;
      document.head.appendChild(style);
    }

    createWidget() {
      // Crear el botón toggle
      this.toggleButton = document.createElement('button');
      this.toggleButton.className = 'automatia-webchat-toggle';
      this.toggleButton.innerHTML = '💬';
      this.toggleButton.title = 'Abrir chat';

      // Crear el contenedor del chat
      this.chatContainer = document.createElement('div');
      this.chatContainer.className = 'automatia-webchat-container';

      // Crear el header
      const header = document.createElement('div');
      header.className = 'automatia-webchat-header';
      header.innerHTML = `
        <span>💬 Chat Automatía</span>
        <button class="automatia-webchat-close">×</button>
      `;

      // Crear el área de mensajes
      this.messagesContainer = document.createElement('div');
      this.messagesContainer.className = 'automatia-webchat-messages';

      // Crear el área de input
      const inputContainer = document.createElement('div');
      inputContainer.className = 'automatia-webchat-input';
      inputContainer.innerHTML = `
        <input type="text" placeholder="Escribe tu mensaje..." maxlength="500">
        <button type="button">Enviar</button>
      `;

      // Crear el indicador de escritura
      this.typingIndicator = document.createElement('div');
      this.typingIndicator.className = 'automatia-typing';
      this.typingIndicator.textContent = 'Bot está escribiendo...';

      // Ensamblar el widget
      this.chatContainer.appendChild(header);
      this.chatContainer.appendChild(this.messagesContainer);
      this.chatContainer.appendChild(this.typingIndicator);
      this.chatContainer.appendChild(inputContainer);

      // Crear el contenedor principal
      this.widget = document.createElement('div');
      this.widget.className = 'automatia-webchat-widget';
      this.widget.appendChild(this.toggleButton);
      this.widget.appendChild(this.chatContainer);

      // Agregar al DOM
      document.body.appendChild(this.widget);

      // Referencias a elementos
      this.input = inputContainer.querySelector('input');
      this.sendButton = inputContainer.querySelector('button');
      this.closeButton = header.querySelector('.automatia-webchat-close');
    }

    bindEvents() {
      // Toggle del chat
      this.toggleButton.addEventListener('click', () => this.toggleChat());

      // Cerrar chat
      this.closeButton.addEventListener('click', () => this.closeChat());

      // Enviar mensaje con Enter
      this.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });

      // Enviar mensaje con botón
      this.sendButton.addEventListener('click', () => this.sendMessage());

      // Cerrar con Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.closeChat();
        }
      });
    }

    toggleChat() {
      if (this.isOpen) {
        this.closeChat();
      } else {
        this.openChat();
      }
    }

    openChat() {
      this.isOpen = true;
      this.chatContainer.style.display = 'flex';
      this.toggleButton.innerHTML = '✕';
      this.toggleButton.title = 'Cerrar chat';
      this.input.focus();

      // Mensaje de bienvenida si es la primera vez
      if (this.messages.length === 0) {
        this.addMessage('bot', '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?');
      }
    }

    closeChat() {
      this.isOpen = false;
      this.chatContainer.style.display = 'none';
      this.toggleButton.innerHTML = '💬';
      this.toggleButton.title = 'Abrir chat';
    }

    async sendMessage() {
      const text = this.input.value.trim();
      if (!text) return;

      // Agregar mensaje del usuario
      this.addMessage('user', text);
      this.input.value = '';

      // Mostrar indicador de escritura
      this.showTyping();

      try {
        // Enviar mensaje al webhook
        const response = await fetch(`/api/webhooks/webchat/${this.config.channelId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text: text,
            externalUserId: this.externalUserId
          })
        });

        if (response.ok) {
          const data = await response.json();
          this.addMessage('bot', data.response);
        } else {
          throw new Error('Error en la respuesta del servidor');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        this.addMessage('bot', 'Lo siento, ocurrió un error. Inténtalo de nuevo.');
      } finally {
        this.hideTyping();
      }
    }

    addMessage(sender, text) {
      const message = document.createElement('div');
      message.className = `automatia-message ${sender}`;
      message.textContent = text;

      this.messagesContainer.appendChild(message);
      this.messages.push({ sender, text, timestamp: new Date() });

      // Scroll al final
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    showTyping() {
      this.typingIndicator.classList.add('show');
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    hideTyping() {
      this.typingIndicator.classList.remove('show');
    }

    loadMessages() {
      // En una implementación real, cargaría mensajes previos
      // Por ahora, no hacemos nada
    }

    generateUserId() {
      return 'user_' + Math.random().toString(36).substr(2, 9);
    }

    // Métodos públicos para configuración
    updateConfig(newConfig) {
      this.config = { ...this.config, ...newConfig };
      // Recrear estilos si es necesario
      this.createStyles();
    }

    destroy() {
      if (this.widget && this.widget.parentNode) {
        this.widget.parentNode.removeChild(this.widget);
      }
    }
  }

  // Función global para inicializar el widget
  window.initAutomatiaWebchat = function(config) {
    return new AutomatiaWebchat(config);
  };

  // Auto-inicialización si hay elementos con data-automatia-webchat
  document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('[data-automatia-webchat]');
    elements.forEach(element => {
      const config = {
        channelId: element.dataset.channelId || 'default',
        theme: element.dataset.theme || 'dark',
        position: element.dataset.position || 'bottom-right'
      };
      
      window.initAutomatiaWebchat(config);
    });
  });

})();


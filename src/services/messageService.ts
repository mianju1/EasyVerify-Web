import { createVNode, render } from 'vue';
import Message from '../vue/components/Message.vue';

let messageContainer = null;

const createContainer = () => {
  messageContainer = document.createElement('div');
  messageContainer.className = 'message-container';
  document.body.appendChild(messageContainer);
};

const showMessage = ({
  type = 'info',
  message = '',
  duration = 3000
}) => {
  if (!messageContainer) {
    createContainer();
  }

  const container = document.createElement('div');
  messageContainer.appendChild(container);

  const vnode = createVNode(Message, {
    type,
    message,
    duration,
    onDestroy: () => {
      messageContainer.removeChild(container);
    }
  });

  render(vnode, container);
};

export default {
  success(message, duration) {
    showMessage({ type: 'success', message, duration });
  },
  warning(message, duration) {
    showMessage({ type: 'warning', message, duration });
  },
  error(message, duration) {
    showMessage({ type: 'error', message, duration });
  },
  info(message, duration) {
    showMessage({ type: 'info', message, duration });
  }
};

self.addEventListener('message', event => {
    if(event.data.type === 'notification'){
        self.registration.showNotification(event.data.title, event.data);
    }
});
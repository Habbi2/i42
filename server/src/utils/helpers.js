module.exports = {
    generateUniqueId: () => {
        return 'id-' + Math.random().toString(36).substr(2, 16);
    },

    formatDate: (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    },

    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    },

    isEmpty: (obj) => {
        return Object.keys(obj).length === 0;
    }
};
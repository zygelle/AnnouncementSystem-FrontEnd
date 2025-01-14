export const formatDateChat = (dateString: string) => {
    const messageDate = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - messageDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

    if (diffDays === 0) {
        return `Hoje, ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
        return `Ontem, ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
        return messageDate.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }) + ", " +
            messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
};
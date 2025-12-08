export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  export const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  }

  export const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }
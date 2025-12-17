



export class JoeFunc {
    

    // 复制文本到剪贴板
    public static copyToClipboard(text: string): boolean {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';  // 防止页面滚动
        document.body.appendChild(textarea);
        textarea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                console.log('复制成功');
                return true;
            } else {
                console.warn('复制失败');
                return false;
            }
        } catch (err) {
            console.error('复制出错:', err);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }








}
function trackOrder() {
    const orderId = document.getElementById('orderId').value;
    const phone = document.getElementById('phone').value;
    const resultSection = document.getElementById('resultSection');

    if (!orderId || !phone) {
        alert("Vui lòng nhập đầy đủ Mã đơn hàng và Số điện thoại!");
        return;
    }

    const btn = document.querySelector('.btn-track');
    const originalText = btn.innerText;
    
    btn.innerText = "ĐANG TÌM...";
    btn.style.opacity = "0.7";
    
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.opacity = "1";
        
        resultSection.style.display = 'none';
        setTimeout(() => {
            resultSection.style.display = 'block';
            
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

    }, 1000);
}
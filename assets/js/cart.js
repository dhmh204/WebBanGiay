document.addEventListener('DOMContentLoaded', function() {
    // Lấy checkbox "Chọn tất cả"
    const checkboxAll = document.getElementById('checkbox-all-products');
    
    // Lấy tất cả checkbox của sản phẩm (loại trừ checkbox "Chọn tất cả")
    const productCheckboxes = document.querySelectorAll('input.checkbox-add-cart[type="checkbox"]:not(#checkbox-all-products)');
    
    // Lấy số lượng sản phẩm hiển thị
    const numItemsElement = document.querySelector('.num-items-checkbox');
    
    console.log('Checkbox All found:', !!checkboxAll);
    console.log('Product checkboxes found:', productCheckboxes.length);
    
    // Hàm cập nhật trạng thái checkbox "Chọn tất cả"
    function updateSelectAllCheckbox() {
        if (!checkboxAll) return;
        
        const checkedProducts = document.querySelectorAll('input.checkbox-add-cart[type="checkbox"]:not(#checkbox-all-products):checked');
        
        console.log('Checked products:', checkedProducts.length, 'Total:', productCheckboxes.length);
        
        // Nếu tất cả checkbox sản phẩm đều được chọn
        if (checkedProducts.length === productCheckboxes.length && productCheckboxes.length > 0) {
            checkboxAll.checked = true;
            checkboxAll.indeterminate = false;
        } 
        // Nếu không có checkbox nào được chọn
        else if (checkedProducts.length === 0) {
            checkboxAll.checked = false;
            checkboxAll.indeterminate = false;
        } 
        // Nếu một số checkbox được chọn
        else {
            checkboxAll.checked = false;
            checkboxAll.indeterminate = true;
        }
        
        // Cập nhật số lượng sản phẩm đã chọn
        if (numItemsElement) {
            numItemsElement.textContent = checkedProducts.length;
        }
        
        // Cập nhật tổng tiền
        updateTotalPrice();
    }
    
    // Hàm tính tổng tiền các sản phẩm được chọn
    function updateTotalPrice() {
        let total = 0;
        const checkedProducts = document.querySelectorAll('input.checkbox-add-cart[type="checkbox"]:not(#checkbox-all-products):checked');
        
        checkedProducts.forEach(function(checkbox) {
            // Lấy ID sản phẩm từ checkbox
            const checkboxId = checkbox.id;
            const productId = checkboxId.replace('checkbox-product-', '');
            
            // Tìm phần tử chứa sản phẩm
            const productItem = checkbox.closest('.item-product-cart');
            if (!productItem) return;
            
            // Tìm số lượng và giá của sản phẩm trong cùng productItem
            const quantityInput = productItem.querySelector('.qty-carts');
            const priceElement = productItem.querySelector('.cart-price-total .price');
            
            if (quantityInput && priceElement) {
                const quantity = parseInt(quantityInput.value) || 1;
                // Lấy giá số từ chuỗi (bỏ "đ" và dấu chấm)
                const priceText = priceElement.textContent.trim();
                const price = parseInt(priceText.replace(/\./g, '').replace(' đ', '')) || 0;
                
                console.log(`Product ${productId}: Quantity=${quantity}, Price=${price}, Subtotal=${price * quantity}`);
                total += price * quantity;
            }
        });
        
        console.log('Total calculated:', total);
        
        // Cập nhật tổng tiền hiển thị
        const totalElements = document.querySelectorAll('.total-cart-page .price');
        if (totalElements.length >= 2) {
            // Cập nhật "Thành tiền"
            totalElements[0].textContent = formatCurrency(total);
            
            // Cập nhật "Tổng Số Tiền" (giả sử bằng thành tiền, không có phí khác)
            totalElements[1].textContent = formatCurrency(total);
        }
        
        // Kích hoạt hoặc vô hiệu hóa nút thanh toán
        // const checkoutButton = document.querySelector('.btn-checkout');
        // if (checkoutButton) {
        //     if (checkedProducts.length > 0) {
        //         checkoutButton.classList.remove('btn-checkout-disable');
        //         checkoutButton.disabled = false;
        //     } else {
        //         checkoutButton.classList.add('btn-checkout-disable');
        //         checkoutButton.disabled = true;
        //     }
        // }
    }
    
    // Hàm định dạng tiền tệ
    function formatCurrency(amount) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
    }
    
    // Xử lý sự kiện cho checkbox "Chọn tất cả"
    if (checkboxAll) {
        checkboxAll.addEventListener('change', function() {
            const isChecked = this.checked;
            console.log('Select All clicked:', isChecked);
            
            // Chọn/bỏ chọn tất cả sản phẩm
            productCheckboxes.forEach(function(checkbox) {
                checkbox.checked = isChecked;
                
                // Kích hoạt sự kiện change để cập nhật UI
                checkbox.dispatchEvent(new Event('change'));
            });
        });
    }
    
    // Xử lý sự kiện cho từng checkbox sản phẩm
    productCheckboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            console.log('Product checkbox changed:', this.id, this.checked);
            updateSelectAllCheckbox();
        });
    });
    
    // Xử lý sự kiện thay đổi số lượng
    const quantityInputs = document.querySelectorAll('.qty-carts');
    quantityInputs.forEach(function(input) {
        input.addEventListener('change', function() {
            console.log('Quantity changed:', this.id, this.value);
            
            // Tìm checkbox của sản phẩm này
            const productItem = this.closest('.item-product-cart');
            if (productItem) {
                const checkbox = productItem.querySelector('input.checkbox-add-cart[type="checkbox"]');
                if (checkbox && checkbox.checked) {
                    updateTotalPrice();
                }
            }
        });
        
        // Cũng thêm sự kiện input để cập nhật ngay lập tức
        input.addEventListener('input', function() {
            const productItem = this.closest('.item-product-cart');
            if (productItem) {
                const checkbox = productItem.querySelector('input.checkbox-add-cart[type="checkbox"]');
                if (checkbox && checkbox.checked) {
                    updateTotalPrice();
                }
            }
        });
    });
    
   // Xử lý sự kiện click nút tăng/giảm số lượng - SỬA LẠI
document.addEventListener('click', function(e) {
    // Kiểm tra nếu click vào nút GIẢM số lượng
    if (e.target.closest('.btn-subtract-qty')) {
        console.log('Nút giảm số lượng được click');
        
        // Tìm input số lượng tương ứng
        const subtractBtn = e.target.closest('.btn-subtract-qty');
        const quantityInput = subtractBtn.closest('.product-view-quantity-box-block').querySelector('.qty-carts');
        const productItem = subtractBtn.closest('.item-product-cart');
        
        if (quantityInput && productItem) {
            // Giảm số lượng
            let currentQty = parseInt(quantityInput.value) || 1;
            if (currentQty > 1) {
                currentQty--;
                quantityInput.value = currentQty;
                
                // Kích hoạt sự kiện change
                quantityInput.dispatchEvent(new Event('change'));
                quantityInput.dispatchEvent(new Event('input'));
                
                // Cập nhật tổng tiền ngay lập tức
                setTimeout(() => {
                    updateTotalPrice();
                }, 10);
            }
        }
    }
    
    // Kiểm tra nếu click vào nút TĂNG số lượng
    if (e.target.closest('.btn-add-qty')) {
        console.log('Nút tăng số lượng được click');
        
        // Tìm input số lượng tương ứng
        const addBtn = e.target.closest('.btn-add-qty');
        const quantityInput = addBtn.closest('.product-view-quantity-box-block').querySelector('.qty-carts');
        const productItem = addBtn.closest('.item-product-cart');
        
        if (quantityInput && productItem) {
            // Tăng số lượng
            let currentQty = parseInt(quantityInput.value) || 1;
            currentQty++;
            quantityInput.value = currentQty;
            
            // Kích hoạt sự kiện change
            quantityInput.dispatchEvent(new Event('change'));
            quantityInput.dispatchEvent(new Event('input'));
            
            // Cập nhật tổng tiền ngay lập tức
            setTimeout(() => {
                updateTotalPrice();
            }, 10);
        }
    }
});

// Cách 2: Ghi đè hàm gốc nếu có
if (window.cart && window.cart.subtractQty) {
    // Lưu hàm gốc
    const originalSubtractQty = window.cart.subtractQty;
    // Ghi đè hàm
    window.cart.subtractQty = function(productId, event) {
        console.log('Gọi hàm subtractQty gốc với sản phẩm:', productId);
        // Gọi hàm gốc
        const result = originalSubtractQty.call(this, productId, event);
        
        // Cập nhật tổng tiền sau khi giảm số lượng
        setTimeout(() => {
            updateTotalPrice();
        }, 50);
        
        return result;
    };
}

if (window.cart && window.cart.addQty) {
    // Lưu hàm gốc
    const originalAddQty = window.cart.addQty;
    // Ghi đè hàm
    window.cart.addQty = function(productId, event) {
        console.log('Gọi hàm addQty gốc với sản phẩm:', productId);
        // Gọi hàm gốc
        const result = originalAddQty.call(this, productId, event);
        
        // Cập nhật tổng tiền sau khi tăng số lượng
        setTimeout(() => {
            updateTotalPrice();
        }, 50);
        
        return result;
    };
}

// Hàm updateTotalPrice đã có trong code của bạn
function updateTotalPrice() {
    let total = 0;
    const checkedProducts = document.querySelectorAll('input.checkbox-add-cart[type="checkbox"]:not(#checkbox-all-products):checked');
    
    checkedProducts.forEach(function(checkbox) {
        const productItem = checkbox.closest('.item-product-cart');
        if (!productItem) return;
        
        const quantityInput = productItem.querySelector('.qty-carts');
        const priceElement = productItem.querySelector('.cart-price-total .price');
        
        if (quantityInput && priceElement) {
            const quantity = parseInt(quantityInput.value) || 1;
            const priceText = priceElement.textContent.trim();
            const price = parseInt(priceText.replace(/\./g, '').replace(' đ', '')) || 0;
            
            console.log(`Sản phẩm: Số lượng=${quantity}, Giá=${price}, Thành tiền=${price * quantity}`);
            total += price * quantity;
        }
    });
    
    console.log('Tổng tiền sau khi cập nhật:', total);
    
    // Cập nhật hiển thị tổng tiền
    const totalElements = document.querySelectorAll('.total-cart-page .price');
    if (totalElements.length >= 2) {
        totalElements[0].textContent = formatCurrency(total);
        totalElements[1].textContent = formatCurrency(total);
    }
}

// Hàm định dạng tiền tệ
function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
}
    // Khởi tạo trạng thái ban đầu
    updateSelectAllCheckbox();
});


// ------------------------------
// Phiên bản đơn giản - xóa ngay lập tức
document.addEventListener('click', function(e) {
    // Kiểm tra click vào bất kỳ icon thùng rác nào
    if (e.target.closest('.btn-remove-desktop-cart') || 
        e.target.closest('.btn-remove-mobile-cart') ||
        e.target.closest('.bi-trash') ||
        e.target.closest('.fa-trash-o')) {
        
        e.preventDefault();
        e.stopPropagation();
        
        // Tìm sản phẩm
        const deleteBtn = e.target.closest('a');
        const productItem = deleteBtn?.closest('.item-product-cart');
        
        if (productItem) {
            // Hỏi xác nhận
            if (confirm('Xóa sản phẩm này khỏi giỏ hàng?')) {
                // Xóa ngay
                productItem.remove();
                
                // Cập nhật UI
                updateCartUI();
                
                // Hiển thị thông báo nhanh
                alert('Đã xóa sản phẩm thành công!');
            }
        }
    }
});

// Hàm cập nhật UI sau khi xóa
function updateCartUI() {
    // 1. Đếm số sản phẩm còn lại
    const remainingItems = document.querySelectorAll('.item-product-cart');
    const count = remainingItems.length;
    
    // 2. Cập nhật tiêu đề
    const titleElement = document.querySelector('.cart-title-num-items');
    if (titleElement) {
        titleElement.textContent = `(${count} sản phẩm)`;
    }
    
    // 3. Cập nhật checkbox "Chọn tất cả"
    const checkboxAll = document.getElementById('checkbox-all-products');
    if (checkboxAll) {
        if (count === 0) {
            checkboxAll.checked = false;
            checkboxAll.disabled = true;
        } else {
            checkboxAll.disabled = false;
        }
    }
    
    // 4. Cập nhật số lượng checkbox
    const numItemsElement = document.querySelector('.num-items-checkbox');
    if (numItemsElement) {
        const checkedItems = document.querySelectorAll('.checkbox-add-cart:not(#checkbox-all-products):checked').length;
        numItemsElement.textContent = checkedItems;
    }
    
    // 5. Tính lại tổng tiền
    updateTotalPrice();
    
    // 6. Nếu giỏ hàng trống
    if (count === 0) {
        const cartContent = document.querySelector('.product-cart-left');
        if (cartContent) {
            cartContent.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <h3>Giỏ hàng của bạn đang trống</h3>
                    <p>Hãy thêm sản phẩm vào giỏ hàng!</p>
                </div>
            `;
        }
    }
}

// Hàm xóa sản phẩm bằng ID
function deleteProductById(productId) {
    const productItem = document.querySelector(`#checkbox-product-${productId}`)?.closest('.item-product-cart');
    if (productItem) {
        productItem.remove();
        updateCartUI();
    }
}

// Hàm xóa nhiều sản phẩm
function deleteSelectedProducts() {
    const selectedCheckboxes = document.querySelectorAll('.checkbox-add-cart:not(#checkbox-all-products):checked');
    
    if (selectedCheckboxes.length === 0) {
        alert('Vui lòng chọn ít nhất một sản phẩm để xóa!');
        return;
    }
    
    if (confirm(`Bạn có chắc chắn muốn xóa ${selectedCheckboxes.length} sản phẩm đã chọn?`)) {
        selectedCheckboxes.forEach(checkbox => {
            const productItem = checkbox.closest('.item-product-cart');
            if (productItem) {
                productItem.remove();
            }
        });
        
        updateCartUI();
        alert(`Đã xóa ${selectedCheckboxes.length} sản phẩm thành công!`);
    }
}

// Thêm nút "Xóa sản phẩm đã chọn" (tùy chọn)
// function addDeleteSelectedButton() {
//     const cartHeader = document.querySelector('.header-cart-item');
//     if (cartHeader && !document.querySelector('.btn-delete-selected')) {
//         const deleteBtn = document.createElement('div');
//         deleteBtn.className = 'btn-delete-selected';
//         deleteBtn.innerHTML = `
//             <button style="
//                 background: #dc3545;
//                 color: white;
//                 border: none;
//                 padding: 5px 15px;
//                 border-radius: 4px;
//                 cursor: pointer;
//                 margin-left: 10px;
//                 font-size: 14px;
//             ">
//                 Xóa đã chọn
//             </button>
//         `;
//         cartHeader.appendChild(deleteBtn);
        
//         // Thêm sự kiện click
//         deleteBtn.querySelector('button').addEventListener('click', deleteSelectedProducts);
//     }
// }

// Khởi tạo
addDeleteSelectedButton();
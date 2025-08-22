 document.querySelectorAll('.product-card img').forEach(function(img) {
            img.addEventListener('mouseenter', function() {
                if (img.dataset.back) {
                    img.src = img.dataset.back;
                }
            });
            img.addEventListener('mouseleave', function() {
                if (img.dataset.front) {
                    img.src = img.dataset.front;
                }
            });
        });
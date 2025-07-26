const encryptDropzone = document.getElementById('encrypt-dropzone');
const encryptInput = document.getElementById('encrypt-input');
const encryptPreviewContainer = document.getElementById('encrypt-preview-container');
const encryptPreview = document.getElementById('encrypt-preview');
const encryptKeyInput = document.getElementById('encrypt-key');
const encryptBtn = document.getElementById('encrypt-btn');
const generateKeyBtn = document.getElementById('generate-key');

const decryptDropzone = document.getElementById('decrypt-dropzone');
const decryptInput = document.getElementById('decrypt-input');
const decryptPreviewContainer = document.getElementById('decrypt-preview-container');
const decryptPreview = document.getElementById('decrypt-preview');
const decryptKeyInput = document.getElementById('decrypt-key');
const decryptBtn = document.getElementById('decrypt-btn');

// Fixed: Updated to match new HTML structure
const originalImage = document.getElementById('original-image');
const encryptedPreview = document.getElementById('encrypted-preview');
const downloadSection = document.getElementById('download-section');
const downloadBtn = document.getElementById('download-btn');

// Event Listeners for Encryption
encryptDropzone.addEventListener('click', () => encryptInput.click());
encryptDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    encryptDropzone.classList.add('active');
});
encryptDropzone.addEventListener('dragleave', () => {
    encryptDropzone.classList.remove('active');
});
encryptDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    encryptDropzone.classList.remove('active');
    if (e.dataTransfer.files.length) {
        encryptInput.files = e.dataTransfer.files;
        handleEncryptImageUpload();
    }
});
encryptInput.addEventListener('change', handleEncryptImageUpload);

// Event Listeners for Decryption
decryptDropzone.addEventListener('click', () => decryptInput.click());
decryptDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    decryptDropzone.classList.add('active');
});
decryptDropzone.addEventListener('dragleave', () => {
    decryptDropzone.classList.remove('active');
});
decryptDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    decryptDropzone.classList.remove('active');
    if (e.dataTransfer.files.length) {
        decryptInput.files = e.dataTransfer.files;
        handleDecryptImageUpload();
    }
});
decryptInput.addEventListener('change', handleDecryptImageUpload);

// Generate random encryption key
generateKeyBtn.addEventListener('click', () => {
    const array = new Uint32Array(8);
    window.crypto.getRandomValues(array);
    const key = Array.from(array, dec => ('00000000' + dec.toString(16)).slice(-8)).join('');
    encryptKeyInput.value = key;
    validateEncryptForm();
});

// Validate encryption form
encryptKeyInput.addEventListener('input', validateEncryptForm);
decryptKeyInput.addEventListener('input', validateDecryptForm);

// Encrypt/Decrypt button events
encryptBtn.addEventListener('click', encryptImage);
decryptBtn.addEventListener('click', decryptImage);

// Handle encrypt image upload
function handleEncryptImageUpload() {
    const file = encryptInput.files[0];
    if (file && file.type.match('image.*')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            encryptPreview.src = e.target.result;
            // Fixed: Show original image in third column and make it visible
            originalImage.src = e.target.result;
            originalImage.style.display = 'block';
            originalImage.previousElementSibling.textContent = 'Original Image';
            
            encryptPreviewContainer.classList.remove('hidden');
            document.getElementById('encrypt-instructions').classList.add('hidden');
            validateEncryptForm();
        };
        reader.readAsDataURL(file);
    }
}

// Handle decrypt image upload
function handleDecryptImageUpload() {
    const file = decryptInput.files[0];
    if (file && file.name.endsWith('.enc')) {
        // Fixed: Show file name instead of preview for encrypted files
        const fileInfo = document.createElement('div');
        fileInfo.textContent = `📁 ${file.name}`;
        fileInfo.className = 'text-white text-sm bg-gray-800 p-2 rounded';
        
        decryptPreviewContainer.innerHTML = '';
        decryptPreviewContainer.appendChild(fileInfo);
        decryptPreviewContainer.classList.remove('hidden');
        document.getElementById('decrypt-instructions').classList.add('hidden');
        validateDecryptForm();
    } else {
        alert('Please upload a valid encrypted file with .enc extension');
    }
}

// Validate encryption form
function validateEncryptForm() {
    if (encryptInput.files.length && encryptKeyInput.value.length >= 8) {
        encryptBtn.disabled = false;
    } else {
        encryptBtn.disabled = true;
    }
}

// Validate decryption form
function validateDecryptForm() {
    if (decryptInput.files.length && decryptKeyInput.value.length > 0) {
        decryptBtn.disabled = false;
    } else {
        decryptBtn.disabled = true;
    }
}

// Simulate encryption process
function encryptImage() {
    if (!encryptInput.files.length || !encryptKeyInput.value) return;
    
    // Show loading state
    encryptBtn.innerHTML = '<svg class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>ENCRYPTING...';
    encryptBtn.disabled = true;
    
    // Simulate encryption process (2 seconds)
    setTimeout(() => {
        // Fixed: Show encrypted result in third column
        encryptedPreview.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwMCIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMDBmZjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RU5DUllQVEVEIERBVEE8L3RleHQ+PC9zdmc+";
        encryptedPreview.style.display = 'block';
        encryptedPreview.nextElementSibling.textContent = 'Encrypted Result';
        
        // Show download section
        downloadSection.classList.remove('hidden');
        
        // Reset button
        encryptBtn.innerHTML = '<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>ENCRYPT & SECURE';
        encryptBtn.disabled = false;
        
        // Success notification
        showNotification('Image encrypted successfully! 🔒', 'success');
    }, 2000);
}

// Simulate decryption process
function decryptImage() {
    if (!decryptInput.files.length || !decryptKeyInput.value) return;
    
    // Show loading state
    decryptBtn.innerHTML = '<svg class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>DECRYPTING...';
    decryptBtn.disabled = true;
    
    // Simulate decryption process (2 seconds)
    setTimeout(() => {
        // For demo purposes, show a decrypted placeholder image
        const decryptedImage = document.createElement('img');
        decryptedImage.src = originalImage.src || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzRmNDZlNSIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ERUNSWVBURUQ8L3RleHQ+PC9zdmc+";
        decryptedImage.className = 'mx-auto max-h-32 mb-3 rounded-lg shadow-2xl';
        
        decryptPreviewContainer.innerHTML = '';
        decryptPreviewContainer.appendChild(decryptedImage);
        decryptPreviewContainer.classList.remove('hidden');
        
        // Reset button
        decryptBtn.innerHTML = '<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>DECRYPT & REVEAL';
        decryptBtn.disabled = false;
        
        // Success notification
        showNotification('Image decrypted successfully! 🔓', 'success');
    }, 2000);
}

// Download encrypted image (simulated)
downloadBtn.addEventListener('click', () => {
    // Create a simulated encrypted file
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 200;
    
    // Fill with random encrypted-looking data
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.random() * 255;     // Red
        data[i + 1] = Math.random() * 255; // Green
        data[i + 2] = Math.random() * 255; // Blue
        data[i + 3] = 255;                 // Alpha
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Download the "encrypted" file
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'encrypted_image.enc';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    // Show download confirmation
    downloadBtn.innerHTML = '<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>DOWNLOADED!';
    setTimeout(() => {
        downloadBtn.innerHTML = '<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>DOWNLOAD';
    }, 2000);
});

// Fixed: Add notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
        type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
    } text-white font-semibold`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('opacity-100'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('opacity-0');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}
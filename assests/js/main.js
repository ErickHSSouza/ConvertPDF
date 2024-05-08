// Carrega a biblioteca jsPDF
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js';
script.onload = function () {
    // O código só será executado após a biblioteca jsPDF ser carregada com sucesso
    document.getElementById('convertBtn').addEventListener('click', () => {
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function(event) {
                const fileContent = event.target.result;
                const pdf = new jsPDF();
                const currentDate = new Date().toLocaleDateString().replace(/\//g, '-');

                // Check file type and convert accordingly
                if (file.type === 'application/pdf') {
                    alert('Este arquivo já é um PDF.');
                    return;
                } else if (file.type === 'text/plain') {
                    pdf.text(fileContent, 10, 10);
                } else if (file.type.includes('image')) {
                    const img = new Image();
                    img.src = fileContent;
                    img.onload = function() {
                        const width = this.width / 4;
                        const height = this.height / 4;
                        pdf.addImage(this, 'JPEG', 10, 10, width, height);
                        pdf.save(file.name.split('.')[0] + '_' + currentDate + '.pdf');
                    };
                    return;
                } else {
                    alert('Não é possível converter este tipo de arquivo para PDF.');
                    return;
                }

                pdf.save(file.name.split('.')[0] + '_' + currentDate + '.pdf');
            };

            reader.onprogress = function(event) {
                if (event.lengthComputable) {
                    const percentLoaded = Math.round((event.loaded / event.total) * 100);
                    document.getElementById('progress').style.width = percentLoaded + '%';
                    document.getElementById('progress').textContent = percentLoaded + '%';
                }
            };

            reader.onerror = function(event) {
                alert('Erro ao ler o arquivo.');
            };

            reader.readAsDataURL(file);
        } else {
            alert('Por favor, selecione um arquivo.');
        }
    });

    document.getElementById('fileInput').addEventListener('change', function(event) {
        const file = event.target.files[0];
        const preview = document.getElementById('preview');

        preview.innerHTML = '';

        if (file.type.includes('image')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.style.maxWidth = '100%';
            preview.appendChild(img);
        } else {
            const para = document.createElement('p');
            para.textContent = 'Pré-visualização do arquivo não suportada.';
            preview.appendChild(para);
        }
    });
};
document.head.appendChild(script);

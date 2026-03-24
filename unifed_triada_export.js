// TESTE DIRETO - Copie e cole no console F12
(function() {
    console.log('=== INJETANDO BOTÕES MANUALMENTE ===');
    
    // Criar os 3 botões
    var botoes = [
        { id: 'unifedPdfRelatorioBtn', label: 'RELATÓRIO PERICIAL', icon: 'fa-file-pdf', color: '#00E5FF' },
        { id: 'unifedPdfAnexoBtn', label: 'ANEXO · CUSTÓDIA', icon: 'fa-file-contract', color: '#F59E0B' },
        { id: 'unifedDocxMatrizBtn', label: 'MATRIZ JURÍDICA', icon: 'fa-file-word', color: '#10B981' }
    ];
    
    // Encontrar contentor
    var toolbar = document.querySelector('.toolbar-grid');
    if (!toolbar) {
        toolbar = document.querySelector('.toolbar-section');
        if (toolbar) {
            var newGrid = document.createElement('div');
            newGrid.className = 'toolbar-grid';
            toolbar.appendChild(newGrid);
            toolbar = newGrid;
        }
    }
    
    if (!toolbar) {
        console.error('Nenhum contentor encontrado!');
        // Criar contentor no topo
        var analysis = document.querySelector('.analysis-area');
        if (analysis) {
            toolbar = document.createElement('div');
            toolbar.className = 'toolbar-grid';
            toolbar.style.cssText = 'display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin: 16px; padding: 12px; background: rgba(0,0,0,0.3); border-radius: 8px;';
            analysis.insertBefore(toolbar, analysis.firstChild);
        }
    }
    
    if (!toolbar) {
        console.error('FALHA CRÍTICA: Não foi possível criar contentor');
        return;
    }
    
    // Remover botões existentes
    botoes.forEach(function(b) {
        var old = document.getElementById(b.id);
        if (old) old.remove();
    });
    
    // Criar e injetar
    botoes.forEach(function(b) {
        var btn = document.createElement('button');
        btn.id = b.id;
        btn.className = 'btn-tool';
        btn.style.cssText = 'display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; background: rgba(0,229,255,0.1); border: 1px solid ' + b.color + '; border-left: 3px solid ' + b.color + '; color: #00E5FF; font-family: monospace; font-size: 0.75rem; font-weight: 600; cursor: pointer; border-radius: 4px; margin: 0 4px;';
        
        var icon = document.createElement('i');
        icon.className = 'fas ' + b.icon;
        
        var text = document.createTextNode(' ' + b.label);
        
        btn.appendChild(icon);
        btn.appendChild(text);
        
        btn.onclick = function() {
            alert('Botão ' + b.label + ' clicado! Implementar exportação.');
        };
        
        toolbar.appendChild(btn);
        console.log('✅ Botão criado:', b.id);
    });
    
    console.log('=== 3 BOTÕES INJETADOS MANUALMENTE ===');
})();
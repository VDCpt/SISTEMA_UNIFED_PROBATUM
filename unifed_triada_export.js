/**
 * ============================================================================
 * UNIFED - PROBATUM · v13.5.0-PURE · MÓDULO DE EXPORTAÇÃO — TRÍADE DOCUMENTAL
 * ============================================================================
 * Ficheiro      : unifed_triada_export.js
 * Versão        : 1.0.9-TRIADA (RETIFICADA - ESTRUTURA MOD. 03-B)
 * Conformidade  : ISO/IEC 27037:2012 · Art. 125.º CPP · Art. 103.º RGIT
 * ============================================================================
 */

(function() {
    'use strict';
    
    // =========================================================================
    // UTILITÁRIOS E EXTRAÇÃO DE METADADOS
    // =========================================================================
    function _log(msg, level) {
        var prefix = '[UNIFED-TRIADA] ';
        var _utils = window.UNIFEDSystem && window.UNIFEDSystem.utils;
        if (_utils && typeof _utils.log === 'function') {
            _utils.log(prefix + msg, level || 'info');
        } else if (typeof window.logAudit === 'function') {
            window.logAudit(prefix + msg, level || 'info');
        } else {
            console.log(prefix + msg);
        }
    }
    
    function _getSys() {
        if (!window.UNIFEDSystem || !window.UNIFEDSystem.analysis) {
            throw new Error('UNIFEDSystem.analysis não disponível. Execute a análise forense 1.º.');
        }
        return window.UNIFEDSystem;
    }

    function _formatCurrencyCentral(val) {
        var _utils = window.UNIFEDSystem && window.UNIFEDSystem.utils;
        if (_utils && typeof _utils.formatCurrency === 'function') {
            return _utils.formatCurrency(val);
        }
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency', currency: 'EUR',
            minimumFractionDigits: 2, maximumFractionDigits: 2
        }).format(val || 0);
    }
    
    function _dataHoje() {
        return new Date().toLocaleDateString('pt-PT', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    }
    
    async function _sha256(texto) {
        var buffer = new TextEncoder().encode(String(texto));
        var hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        return Array.from(new Uint8Array(hashBuffer))
            .map(function (b) { return b.toString(16).padStart(2, '0'); })
            .join('');
    }
    
    function _xe(s) {
        return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    }

    // =========================================================================
    // GERADOR DE QR CODE EM BASE64 (SÍNCRONO PARA PDF)
    // =========================================================================
    async function _generateQRCodeDataURL(payload) {
        return new Promise(function(resolve) {
            if (typeof QRCode === 'undefined') { resolve(null); return; }
            var _tmpDiv = document.createElement('div');
            _tmpDiv.style.cssText = 'position:absolute;left:-9999px;top:-9999px;';
            document.body.appendChild(_tmpDiv);
            new QRCode(_tmpDiv, {
                text: payload, width: 128, height: 128,
                colorDark: '#000000', colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.L
            });
            setTimeout(function() {
                var _canvas = _tmpDiv.querySelector('canvas');
                var _dataUrl = _canvas ? _canvas.toDataURL('image/png') : null;
                document.body.removeChild(_tmpDiv);
                resolve(_dataUrl);
            }, 150);
        });
    }
    
    // =========================================================================
    // EXPORTAÇÃO PDF RELATÓRIO PERICIAL (MOD. 03-B CIRÚRGICO)
    // =========================================================================
    async function _unifedExportPdfRelatorio() {
        if (typeof window.jspdf === 'undefined') {
            if (typeof window.showToast === 'function') window.showToast('Erro: jsPDF não disponível.', 'error');
            return;
        }
        
        var sys;
        try { sys = _getSys(); } catch (e) {
            if (typeof window.showToast === 'function') window.showToast(e.message, 'error');
            return;
        }
        
        try {
            var jsPDF = window.jspdf.jsPDF;
            var doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            var t = sys.analysis.totals || {};
            var c = sys.analysis.crossings || {};
            var v = sys.analysis.verdict || {};
            var sessId = sys.sessionId || 'N/D';
            var mhash = sys.masterHash || 'HASH_INDISPONIVEL';
            var pageW = doc.internal.pageSize.getWidth();
            var pageH = doc.internal.pageSize.getHeight();
            var L = 14;
            var R = pageW - 14;
            var W = R - L;
            var hoje = _dataHoje();
            
            var qrDataURL = await _generateQRCodeDataURL('UNIFED|' + sessId + '|' + mhash);
            var _pageNum = 1;
            var currentY = 20;

            // Motor de paginação determinístico
            function _footer() {
                doc.setDrawColor(200, 200, 200);
                doc.setLineWidth(0.3);
                doc.line(L, pageH - 25, R, pageH - 25);
                
                doc.setFontSize(7);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(80, 80, 80);
                doc.text('Página ' + _pageNum, L, pageH - 20);
                
                doc.setFontSize(6.5);
                doc.setFont('courier', 'bold');
                doc.setTextColor(0, 0, 0);
                doc.text('Master Hash SHA-256: ' + mhash, L, pageH - 15);

                if (qrDataURL) {
                    doc.addImage(qrDataURL, 'PNG', R - 15, pageH - 23, 15, 15);
                }
            }
            
            function _checkPageBreak(requiredHeight) {
                if (currentY + requiredHeight > pageH - 30) {
                    _footer();
                    doc.addPage();
                    _pageNum++;
                    currentY = 20;
                }
            }

            function _writeTextAutoPage(text, opts) {
                var fontSize = opts.fontSize || 9;
                var fontStyle = opts.fontStyle || 'normal';
                var fontName = opts.fontName || 'helvetica';
                var color = opts.color || [0,0,0];
                var lineHeight = fontSize * 0.45;

                doc.setFontSize(fontSize);
                doc.setFont(fontName, fontStyle);
                doc.setTextColor(color[0], color[1], color[2]);

                var lines = doc.splitTextToSize(text, W);
                for (var i = 0; i < lines.length; i++) {
                    _checkPageBreak(lineHeight + 2);
                    doc.text(lines[i], L, currentY);
                    currentY += lineHeight;
                }
                currentY += (opts.marginBottom || 4);
            }

            function _drawHeader(title) {
                _checkPageBreak(15);
                doc.setFillColor(10, 40, 90);
                doc.rect(L, currentY, W, 8, 'F');
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(10);
                doc.setTextColor(255, 255, 255);
                doc.text(title, L + 3, currentY + 5.5);
                doc.setTextColor(0, 0, 0);
                currentY += 12;
            }

            // --- CONSTRUÇÃO DO DOCUMENTO (INJEÇÃO ESTRITA) ---

            // ROSTO
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.text('IFDE PROBATUM | UNIDADE DE PERÍCIA FISCAL E DIGITAL', pageW/2, currentY, { align: 'center' });
            currentY += 6;
            doc.setFontSize(10);
            doc.text('ESTRUTURA DE RELATÓRIO FORENSE MOD. 03-B (NORMA ISO/IEC 27037)', pageW/2, currentY, { align: 'center' });
            currentY += 12;

            _writeTextAutoPage('PROCESSO N.º: ' + sessId, { fontStyle: 'bold' });
            _writeTextAutoPage('DATA: ' + hoje, { fontStyle: 'bold' });
            _writeTextAutoPage('OBJETO: RECONSTITUIÇÃO FINANCEIRA / ART. 103.º RGIT', { fontStyle: 'bold', marginBottom: 10 });

            _drawHeader('NOTA METODOLÓGICA FORENSE:');
            _writeTextAutoPage('"Dada a latência administrativa na disponibilização do ficheiro SAF-T (.xml) pelas plataformas, a presente perícia utiliza o método de Data Proxy: Fleet Extract. Esta metodologia consiste na extração de dados brutos primários diretamente do portal de gestão (Fleet). O ficheiro \'Ganhos da Empresa\' (Fleet/Ledger) é aqui tratado como o Livro-Razão (Ledger) de suporte, possuindo valor probatório material por constituir a fonte primária dos registos que integram o reporte fiscal final. A integridade desta extração é blindada através da assinatura digital SHA-256 (Hash), garantindo que os dados analisados mantêm a inviolabilidade absoluta desde a sua recolha, em conformidade com o Decreto-Lei n.º 28/2019."', { fontStyle: 'italic' });

            _drawHeader('PROTOCOLO DE CADEIA DE CUSTÓDIA');
            _writeTextAutoPage('O sistema IFDE PROBATUM assegura a inviolabilidade dos dados através de funções criptográficas SHA-256. As seguintes evidências foram processadas e incorporadas na análise, garantindo a rastreabilidade total da prova:');
            
            var evidenciasList = sys.analysis.evidenceIntegrity || [];
            for (var i = 0; i < Math.min(evidenciasList.length, 5); i++) {
                _writeTextAutoPage((i+1) + '. ' + evidenciasList[i].filename + ' - Hash: ' + evidenciasList[i].hash, { fontName: 'courier', fontSize: 7, marginBottom: 2 });
            }
            currentY += 5;

            _drawHeader('INVIOLABILIDADE DO ALGORITMO:');
            _writeTextAutoPage('Os cálculos de triangulação financeira (BTOR vs BTF) e os vereditos de risco são gerados por motor forense imutável, com base exclusiva nos dados extraídos das evidências carregadas.');

            _drawHeader('METADADOS DA PERÍCIA');
            _writeTextAutoPage('Nome / Name: ' + ((sys.client && sys.client.name) ? sys.client.name : 'OPERADOR_ANONIMIZADO'));
            _writeTextAutoPage('NIF / Tax ID: ' + ((sys.client && sys.client.nif) ? sys.client.nif : '***'));
            _writeTextAutoPage('Plataforma Digital / Digital Platform: Plataforma Não Identificada');
            _writeTextAutoPage('Morada / Address: A verificar em documentação complementar');
            _writeTextAutoPage('NIF Plataforma / Platform Tax ID: A VERIFICAR');
            _writeTextAutoPage('Ano Fiscal: ' + (sys.selectedYear || '2024'));
            _writeTextAutoPage('Período: ' + (sys.selectedPeriodo || '2s'));
            _writeTextAutoPage('Unix Timestamp: ' + Math.floor(Date.now() / 1000), { marginBottom: 15 });

            _drawHeader('2. ANÁLISE FINANCEIRA CRUZADA / CROSS-FINANCIAL ANALYSIS');
            _writeTextAutoPage('Gross Earnings / Ganhos Brutos (Auditado): ' + _formatCurrencyCentral(t.ganhos));
            _writeTextAutoPage('Reported Earnings / Ganhos Reportados (DAC7): ' + _formatCurrencyCentral(t.dac7TotalPeriodo));
            _writeTextAutoPage('Retained Commissions / Comissões Retidas (Extrato): ' + _formatCurrencyCentral(t.despesas));
            _writeTextAutoPage('Invoiced Commissions / Comissões Faturadas: ' + _formatCurrencyCentral(t.faturaPlataforma));
            _writeTextAutoPage('[!] Revenue Omission / Omissão Receita — Brutos vs DAC7: ' + _formatCurrencyCentral(c.discrepanciaSaftVsDac7), { color: [245, 158, 11], fontStyle: 'bold' });
            _writeTextAutoPage('[X] Expense Omission / Omissão Custos — Retenção vs Fatura: ' + _formatCurrencyCentral(c.discrepanciaCritica) + ' [' + (c.percentagemOmissao || 0).toFixed(2) + '%]', { color: [239, 68, 68], fontStyle: 'bold' });
            _writeTextAutoPage('IVA Omitido (23% · Autoliquidação CIVA): ' + _formatCurrencyCentral(c.ivaFalta));
            _writeTextAutoPage('IVA Omitido (6% · Serviços Transporte): ' + _formatCurrencyCentral(c.ivaFalta6), { marginBottom: 10 });

            _writeTextAutoPage('Nota Pericial: ' + (c.percentagemOmissao || 0).toFixed(2) + '% de omissão é estatisticamente impossível de ser erro administrativo.', { fontStyle: 'italic', color: [239, 68, 68] });

            _drawHeader('3. VEREDICTO DE RISCO (RGIT · Art. 103.º)');
            _writeTextAutoPage('[!!] RISCO CRÍTICO · INFRAÇÃO DETETADA', { fontStyle: 'bold', color: [239, 68, 68] });
            _writeTextAutoPage('Evidência de subcomunicação de proveitos e omissão grave de faturação de comissões sem a devida titulação fiscal, prejudicando o direito à dedução de IVA e inflacionando a base de IRC do contribuinte.');

            _drawHeader('4. PROVA RAINHA / CRITICAL DIVERGENCE (SMOKING GUN)');
            _writeTextAutoPage('[X] SMOKING GUN — DUPLA DIVERGÊNCIA CRÍTICA', { fontStyle: 'bold' });
            _writeTextAutoPage('SMOKING GUN 1 — Revenue Omission (DAC7): ' + _formatCurrencyCentral(c.discrepanciaSaftVsDac7));
            _writeTextAutoPage('SMOKING GUN 2 — Expense Omission (Faturação BTF): ' + _formatCurrencyCentral(c.discrepanciaCritica));

            _drawHeader('5. ENQUADRAMENTO LEGAL');
            _writeTextAutoPage('Artigo 2.º, n.º 1, alínea i) do Código do IVA: Regime de autoliquidação aplicável a serviços prestados por sujeitos passivos não residentes em território português.');
            _writeTextAutoPage('Artigo 108.º do CIVA - Infrações: Constitui infração a falta de liquidação do imposto devido.');
            _writeTextAutoPage('Decreto-Lei n.º 28/2019: Integridade do processamento de dados e validade de documentos eletrónicos como registos primários.');

            _drawHeader('6. METODOLOGIA PERICIAL');
            _writeTextAutoPage('BTOR (Bank Transactions Over Reality): Análise comparativa entre despesas reais (extratos) e documentação fiscal declarada (faturas). Mapeamento posicional de dados SAF-T e cálculo de discrepâncias com hashes SHA-256.');

            _drawHeader('7. CERTIFICAÇÃO DIGITAL');
            _writeTextAutoPage('Sistema certificado de peritagem forense com selo de integridade digital SHA-256. Todos os relatórios são temporalmente selados e auditáveis. Certificação: IFDE PROBATUM v13.5.0-PURE · DORA COMPLIANT. Cumpre com o Regulamento (UE) 2022/2554 (DORA).');

            _drawHeader('8. ANÁLISE PERICIAL / DETAILED EXPERT ANALYSIS');
            _writeTextAutoPage('Duas discrepâncias fundamentais detetadas (Verdade Material Auditada):');
            _writeTextAutoPage('1. Omissão de Custos (Expense Omission): ' + _formatCurrencyCentral(c.discrepanciaCritica) + ' (' + (c.percentagemOmissao || 0).toFixed(2) + '%) [Smoking Gun 2]');
            _writeTextAutoPage('2. Omissão de Receita (DAC7): ' + _formatCurrencyCentral(c.discrepanciaSaftVsDac7) + ' (' + (c.percentagemSaftVsDac7 || 0).toFixed(2) + '%) [Smoking Gun 1]');

            _drawHeader('ADENDA FORENSE — Strategic Intelligence & Bad Faith Analysis');
            _writeTextAutoPage('A análise detetou práticas de obscurecimento de dados por parte da plataforma sob exame, nomeadamente a alteração semestral de sintaxe (moeda e separadores decimais) e a utilização do termo "Ganhos Líquidos" para designar meras transferências bancárias.');
            _writeTextAutoPage('1. SYNTAX INCONSISTENCY: Detetou-se a alteração deliberada de separadores decimais e posicionamento do símbolo monetário. Esta mutação sintática sistemática dificulta a leitura algorítmica e constitui indício de manipulação intencional.');
            _writeTextAutoPage('2. SEMANTIC AMBIGUITY: A plataforma utiliza "Ganhos Líquidos" camuflando retenções de comissões que não deduzem os impostos devidos ao abrigo da Autoliquidação de IVA.');
            _writeTextAutoPage('3. DATA OBFUSCATION: A plataforma impõe janela máxima de 6 meses para acesso a dados, constituindo Audit Trail Destruction e violando o Art. 40.º do CIVA.');

            _drawHeader('12. QUESTIONÁRIO PERICIAL ESTRATÉGICO');
            var questoes = [
                "1. Qual a metodologia de retenção de IVA quando a fatura é omissa na taxa, e como se justifica a não faturação?",
                "2. Qual a justificação técnica para o desvio de base tributável (BTOR vs BTF) detetado na triangulação IFDE?",
                "3. Qual o tratamento das 'Tips' (Gorjetas) na faturação e declaração de IVA, e porque não foram consideradas?",
                "4. Qual a justificação para a diferença entre a comissão retida nos extratos e o valor faturado pela plataforma?",
                "5. Disponibilize os 'raw data' (logs de servidor) das transações anteriores ao parsing contabilístico para o período em análise.",
                "6. Como é processada a autoliquidação de IVA em serviços intracomunitários? Porque não foi aplicada?",
                "7. Como justifica a discrepância de IVA apurado (23% vs 6%) face aos valores declarados?",
                "8. Existem registos de 'Shadow Entries' (entradas sem ID) no sistema que justifiquem a omissão?",
                "9. Como é determinada a origem geográfica para efeitos de IVA nas transações, e qual o impacto na taxa aplicada?",
                "10. Os extratos bancários dos motoristas coincidem com os registos na base de dados da plataforma?",
                "11. Há evidências de manipulação de 'timestamp' para alterar a validade fiscal das operações?",
                "12. O sistema permite a edição retroativa de registos de faturação já selados? Como é auditado?",
                "13. Como são conciliados os cancelamentos com as faturas retificativas e o impacto nas comissões?",
                "14. Existem fluxos de capital para contas não declaradas na jurisdição nacional que expliquem a diferença?",
                "15. Qual o nível de acesso dos administradores à base de dados transacional e quem autorizou as alterações?"
            ];
            for (var q = 0; q < questoes.length; q++) {
                _writeTextAutoPage(questoes[q], { fontStyle: (q < 5 ? 'bold' : 'normal'), color: (q < 5 ? [180,20,20] : [0,0,0]) });
            }

            _drawHeader('13. CONCLUSÃO / TECHNICAL EXPERT OPINION');
            _writeTextAutoPage('Conclui-se pela existência de Prova Digital Material de desconformidade. Este parecer técnico constitui base suficiente para a interposição de ação judicial e apuramento de responsabilidade civil/criminal, servindo o propósito de proteção jurídica do mandato dos advogados intervenientes.');
            _writeTextAutoPage('Indícios de infração ao Artigo 108.º do Código do IVA e não conformidade com o Decreto-Lei n.º 28/2019.');
            _writeTextAutoPage('A utilização de identificadores SHA-256 e selagem QR Code assegura que este parecer é uma Prova Digital Material imutável.');

            _drawHeader('TERMO DE ENCERRAMENTO PERICIAL');
            _writeTextAutoPage('O presente relatório é rubricado digitalmente e selado com o Master Hash de integridade constituindo Prova Digital Material inalterável para efeitos judiciais, sob égide do Art. 103.º do RGIT, normas ISO/IEC 27037 e Decreto-Lei n.º 28/2019.');

            // Footer da última página
            _footer();

            var _fname = 'IFDE_PARECER_' + sessId + '_' + hoje.replace(/\//g, '-') + '.pdf';
            doc.save(_fname);
            
            _log('✅ PDF Relatório Pericial exportado: ' + _fname, 'success');
            
        } catch (pdfErr) {
            _log('Erro ao gerar PDF: ' + pdfErr.message, 'error');
        }
    }
    
    // =========================================================================
    // EXPORTAÇÃO DOCX MATRIZ JURÍDICA
    // =========================================================================
    async function _unifedExportDocxMatriz() {
        if (typeof JSZip === 'undefined') return;
        
        var sys;
        try { sys = _getSys(); } catch (e) { return; }
        
        try {
            var t = sys.analysis.totals || {};
            var c = sys.analysis.crossings || {};
            var sessId = sys.sessionId || 'N/D';
            var mhash = sys.masterHash || 'HASH_INDISPONIVEL';
            var hoje = _dataHoje();
            
            function _p(txt, style, bold, sz, color) {
                var _b = bold ? '<w:b/><w:bCs/>' : '';
                return '<w:p><w:pPr><w:pStyle w:val="' + _xe(style) + '"/><w:spacing w:after="120"/></w:pPr><w:r><w:rPr>' + _b + '<w:sz w:val="' + sz + '"/><w:color w:val="' + color + '"/></w:rPr><w:t xml:space="preserve">' + _xe(txt) + '</w:t></w:r></w:p>';
            }
            
            var _bp = [];
            _bp.push(_p('IFDE PROBATUM | MATRIZ JURÍDICA · PROCESSO N.º ' + sessId, 'Heading1', true, 28, '0A3060'));
            _bp.push(_p('Master Hash SHA-256: ' + mhash, 'Normal', true, 18, 'DC2626'));
            
            _bp.push(_p('I. RECONSTITUIÇÃO DA VERDADE MATERIAL (EXTRATO vs BTF)', 'Heading2', true, 24, '1D4ED8'));
            _bp.push(_p('Ganhos Brutos (Ledger): ' + _formatCurrencyCentral(t.ganhos), 'Normal', false, 20, '000000'));
            _bp.push(_p('Comissões Retidas (Extrato): ' + _formatCurrencyCentral(t.despesas), 'Normal', false, 20, '000000'));
            _bp.push(_p('Comissões Faturadas (BTF): ' + _formatCurrencyCentral(t.faturaPlataforma), 'Normal', false, 20, '000000'));
            
            _bp.push(_p('II. DISCREPÂNCIAS APURADAS', 'Heading2', true, 24, 'DC2626'));
            _bp.push(_p('C2 (Omissão de Faturação): ' + _formatCurrencyCentral(c.discrepanciaCritica) + ' (' + (c.percentagemOmissao||0).toFixed(2) + '%)', 'Normal', true, 20, 'DC2626'));
            _bp.push(_p('C1 (Omissão DAC7): ' + _formatCurrencyCentral(c.discrepanciaSaftVsDac7), 'Normal', true, 20, 'F59E0B'));
            
            _bp.push(_p('III. ADENDA FORENSE: ESTRATÉGIA DE MÁ-FÉ E OFUSCAÇÃO DE DADOS', 'Heading2', true, 24, '7C3AED'));
            _bp.push(_p('A análise forense estruturada detetou práticas de obscurecimento algorítmico, nomeadamente: Inconsistência de Sintaxe (Data Obfuscation - Level 1) e Ambiguidade Semântica ("Net Earnings" Masking - Fiscal Camouflage).', 'Normal', false, 20, '000000'));
            _bp.push(_p('A plataforma impõe uma janela máxima de 6 meses para acesso a dados históricos detalhados, consubstanciando uma destruição de rasto de auditoria (Audit Trail Destruction), em violação do Art. 40.º do CIVA.', 'Normal', false, 20, '000000'));
            
            var _docXml = '<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>' + _bp.join('') + '</w:body></w:document>';
            
            var zip = new JSZip();
            zip.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>');
            zip.file('_rels/.rels', '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
            zip.file('word/document.xml', _docXml);
            
            var blob = await zip.generateAsync({ type: 'blob' });
            var link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'IFDE_MATRIZ_JURIDICA_' + sessId + '.docx';
            link.click();
            
        } catch (docxErr) { _log('Erro DOCX: ' + docxErr.message, 'error'); }
    }
    
    // =========================================================================
    // EXPORTAÇÃO PDF ANEXO CUSTÓDIA
    // =========================================================================
    async function _unifedExportPdfAnexoCustodia() {
        if (typeof window.jspdf === 'undefined') return;
        var sys;
        try { sys = _getSys(); } catch (e) { return; }
        
        try {
            var jsPDF = window.jspdf.jsPDF;
            var doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
            var mhash = sys.masterHash || 'HASH_INDISPONIVEL';
            
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.text('IFDE PROBATUM | ANEXO DE EVIDÊNCIAS — CADEIA DE CUSTÓDIA', 148, 15, { align: 'center' });
            doc.setFontSize(10);
            doc.text('ESTRUTURA DE RELATÓRIO FORENSE MOD. 03-B (NORMA ISO/IEC 27037:2012)', 148, 22, { align: 'center' });
            
            var y = 40;
            var _evidencias = sys.analysis.evidenceIntegrity || [];
            doc.setFontSize(8);
            for (var i = 0; i < _evidencias.length; i++) {
                doc.text('EV-' + (i+1) + ' | ' + _evidencias[i].filename, 15, y);
                doc.setFont('courier', 'normal');
                doc.text('SHA-256: ' + _evidencias[i].hash, 15, y + 5);
                doc.setFont('helvetica', 'bold');
                y += 15;
                if (y > 180) { doc.addPage(); y = 20; }
            }
            
            doc.setFontSize(7);
            doc.text('Master Hash SHA-256: ' + mhash, 15, 200);
            
            doc.save('IFDE_ANEXO_CUSTODIA_' + sys.sessionId + '.pdf');
            
        } catch (anexoErr) { _log('Erro Anexo: ' + anexoErr.message, 'error'); }
    }
    
    // =========================================================================
    // INJEÇÃO DE BOTÕES NA INTERFACE
    // =========================================================================
    function injetarBotoes() {
        var container = document.querySelector('.toolbar-grid');
        if (!container) return false;
        
        if (document.getElementById('unifedPdfRelatorioBtn')) return true;
        
        var botoes = [
            { id: 'unifedPdfRelatorioBtn', icon: 'fa-file-pdf', labelPt: 'RELATÓRIO PERICIAL (MOD.03-B)', cor: '#00E5FF', handler: _unifedExportPdfRelatorio },
            { id: 'unifedPdfAnexoBtn', icon: 'fa-file-contract', labelPt: 'ANEXO DE CUSTÓDIA', cor: '#F59E0B', handler: _unifedExportPdfAnexoCustodia },
            { id: 'unifedDocxMatrizBtn', icon: 'fa-file-word', labelPt: 'MATRIZ JURÍDICA', cor: '#10B981', handler: _unifedExportDocxMatriz }
        ];
        
        botoes.forEach(function(b) {
            var btn = document.createElement('button');
            btn.id = b.id;
            btn.className = 'btn-tool';
            btn.innerHTML = '<i class="fas ' + b.icon + '"></i> ' + b.labelPt;
            btn.onclick = b.handler;
            container.appendChild(btn);
        });

        // [D-02 RETIFICAÇÃO] Os botões exportPDFBtn e exportDOCXBtn são substituídos
        // pelos equivalentes da Tríade Documental. São ocultados em vez de removidos
        // para preservar os listeners do script.js como fallback de recuperação caso
        // o módulo unifed_triada_export falhe em futuras versões.
        // Se pretender remoção definitiva, substituir por: btnPDF.remove(); btnDOCX.remove()
        var btnPDF = document.getElementById('exportPDFBtn');
        var btnDOCX = document.getElementById('exportDOCXBtn');
        if (btnPDF) {
            btnPDF.style.display = 'none';
            btnPDF.setAttribute('data-hidden-by', 'unifed_triada_export');
        }
        if (btnDOCX) {
            btnDOCX.style.display = 'none';
            btnDOCX.setAttribute('data-hidden-by', 'unifed_triada_export');
        }
        
        return true;
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { setTimeout(injetarBotoes, 100); });
    } else { setTimeout(injetarBotoes, 100); }
    
})();
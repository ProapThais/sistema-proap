# PROAP — execução por etapas no Lovable Cloud

## Situação e limite desta entrega

- Saldo consultado: **4,60 créditos disponíveis**. É uma fotografia do saldo, não garantia de que cubra a primeira etapa inteira.
- Nesta entrega: apenas planejamento e registro das decisões. Nenhuma alteração nas telas, autenticação, configurações ou banco; nenhuma migração, instalação ou publicação.
- Consultar o saldo novamente antes de cada bloco de implementação. Com saldo insuficiente ou zerado, interromper e aguardar renovação ou decisão do usuário; não iniciar blocos que não possam ser validados.
- Preservar as 14 telas, sua identidade visual, os dados fictícios e as funcionalidades existentes, especialmente turmas, matrículas e frequência.

## Decisões autorizadas

- Acesso somente por e-mail e senha, sem Google e sem inclusão de outro provedor.
- Cadastro público fechado. Criação, convite, desativação e gestão de usuários somente por administrador autorizado, com verificação no servidor.
- Demonstração e dados reais separados. Não cadastrar famílias reais antes dos testes de segurança e de backup/restauração.
- Anotações confidenciais possuem autorização própria, sem acesso automático para administradores.
- Registros sociais não são apagados pelo fluxo normal: arquivar ou desativar.

## Etapa 1 — acesso seguro e famílias persistidas

Executar em blocos pequenos, cada um encerrado com testes. Não expandir para os demais módulos antes de todos os critérios desta etapa passarem.

### 1A. Preparação e matriz de acesso

1. Conferir a estrutura e as configurações atuais por leitura, reaproveitando a auditoria e os testes existentes.
2. Confirmar os dados de perfil necessários antes de escrever autenticação: proposta mínima de nome de exibição e situação ativa; papéis de acesso ficam separados.
3. Validar a matriz proposta para Administrador, Serviço Social, Psicólogo, Coordenação, Diretoria, Recepção, Professor e Voluntário. A autorização atual não define detalhadamente quais registros cada papel consulta ou modifica; não presumir acesso amplo.
4. Definir quem atribui autorização confidencial e seu escopo. Enquanto não houver decisão e testes, negar esse acesso por padrão e não integrar anotações confidenciais.
5. Confirmar a conta do primeiro administrador antes de criá-la. Atribuição inicial por operação controlada, nunca pelo primeiro cadastro nem por informação editável pelo próprio usuário.

**Resultado:** matriz explícita de leitura, criação, edição, arquivamento e gestão de usuários, sem privilégios implícitos.

### 1B. Autenticação e proteção

- Habilitar e-mail/senha e desativar cadastro público na configuração do serviço, não apenas esconder um botão. Manter acesso anônimo desabilitado e não ativar confirmação automática de e-mail.
- Reaproveitar o cliente e a integração de sessão já gerados pelo Cloud.
- Acrescentar tela de entrada, solicitação de recuperação e página pública para definir nova senha a partir de recuperação válida, sem alterar o visual das telas existentes.
- Colocar as telas com informações internas sob a proteção de rotas do projeto, mantendo seus endereços atuais. Não criar duas rotas para o mesmo endereço.
- Registrar um único observador de identidade; atualizar a navegação conforme o usuário conectado e limpar consultas e sessão ao sair.
- Verificar autenticação em cada operação privada no servidor; proteção de tela não substitui proteção dos dados.
- Bloquear usuários desativados tanto na interface quanto no banco e no servidor, inclusive quando ainda tiverem uma sessão válida.
- Implementar criação/convite e gestão de usuários com verificação de administrador antes de qualquer operação privilegiada. Senhas não ficam no cadastro da aplicação nem são exibidas em relatórios.

**Resultado:** login individual, recuperação e saída verificadas; usuário sem acesso não recebe informações internas.

### 1C. Estrutura mínima de dados e permissões

| Estrutura | Finalidade |
|---|---|
| `profiles` | Identidade de exibição e situação ativa; vínculo com a conta, sem papel de acesso. Criar somente após confirmação dos dados de perfil. |
| `user_roles` | Papéis atribuídos de forma controlada, separados do perfil e sem edição pelo próprio usuário. |
| Catálogo de permissões e associação por papel | Matriz explícita de ações, com negação por padrão. |
| Autorizações confidenciais | Concessões específicas, com escopo definido; nenhuma concessão automática ao Administrador. |
| `familias` | Campos já presentes: código, responsável, bairro, telefone, situação, data e observações gerais, mais autoria, datas de alteração e arquivamento. Não incluir notas confidenciais nesse campo. |
| Histórico de operações | Registrar autor, ação, registro e horário de criação, edição, arquivamento e mudanças de acesso, sem copiar conteúdo confidencial para logs. |

- Cada tabela pública terá concessões explícitas e políticas de segurança por linha. O banco verifica usuário ativo e permissão para cada ação.
- Não conceder exclusão definitiva de registros sociais à aplicação. Arquivamento mantém o registro e seu histórico.
- Usuários comuns não editam papéis, concessões confidenciais nem o próprio estado de autorização.
- Funções auxiliares de autorização terão acesso restrito e serão testadas contra escalada de privilégios e consultas a registros fora do escopo.

**Separação de demonstração:** manter os exemplos atuais em `src/data/demo.ts`, sem copiá-los para o conjunto real de famílias. A seleção do modo será explícita e o aviso de demonstração continuará visível. As relações fictícias dos demais módulos continuam utilizando seus IDs atuais. Famílias persistidas não entram em turmas ou matrículas fictícias por associação acidental. Testes de persistência usam registros inventados identificáveis, nunca dados de pessoas reais.

### 1D. Integração de famílias

- Evoluir `src/data/repository.ts` para oferecer consultas e gravações autenticadas, mantendo ali o único acesso aos dados pelas páginas.
- Integrar listagem, cadastro, edição e consulta da família sem reconstruir telas. Tratar espera, falha e sucesso real; só confirmar salvamento depois da resposta do banco.
- Preservar busca, filtros e verificação de duplicidade. Usar os registros do modo escolhido na comparação; manter os testes atuais e adaptar o carregamento assíncrono.
- Adicionar arquivamento com permissão específica e consulta de arquivadas somente para quem estiver autorizado.
- Manter integrantes, demandas, atendimentos, encaminhamentos e módulos educacionais em demonstração até suas próprias etapas. A ficha de uma família persistida não exibirá integrantes ou históricos fictícios como se fossem dela.

**Resultado:** cadastro fictício de teste sobrevive à atualização da página, aparece na consulta e pode ser editado ou arquivado por usuário autorizado.

## Validação obrigatória antes de avançar

- Login válido, senha inválida, recuperação válida/inválida, saída, acesso direto por URL e atualização da página.
- Tentativa de cadastro público negada pelo serviço, não só pela interface.
- Usuário desativado e usuário sem papel/permissão bloqueados.
- Criação, leitura, edição e arquivamento de família fictícia com retorno pela interface após recarregar.
- Tentativas diretas de acesso ao servidor e ao banco: sem sessão, papel indevido, registro fora do escopo, alteração do próprio papel e exclusão definitiva.
- Administrador sem concessão confidencial não lê notas confidenciais, inclusive por chamada direta; concessão específica funciona somente no escopo permitido.
- Nenhum exemplo fictício misturado ao conjunto real ou associado a uma família persistida indevidamente.
- Testes de regressão de navegação, duplicidade, ocupação das turmas, matrículas e frequência, incluindo falta justificada e aula cancelada.
- Conferir telas em computador e celular e ausência de erros, sem redesenhar.

Testes automatizados pequenos para regras e políticas, mais uma verificação completa com contas de teste autorizadas e registros fictícios. Não declarar segurança validada apenas porque telas ou botões estão ocultos.

## Etapa 2 — backup e restauração, antes de dados reais

- Definir responsável, frequência, retenção, local protegido das cópias e tempo/perda de dados aceitáveis.
- Verificar no Cloud as datas dos backups disponíveis: backups diários, retenção aproximada de 14 dias e sem recuperação para qualquer instante.
- Usar a exportação oficial do banco para testar restauração em ambiente separado, sem desfazer o projeto atual. Confirmar antes a disponibilidade desse ambiente e seus eventuais custos.
- Testar entrada das contas, leitura de famílias, papéis, bloqueios e histórico depois da restauração. Registrar o procedimento e a evidência do teste.
- Exportação inclui estrutura, dados e contas com hashes de senha; não inclui arquivos de armazenamento, segredos nem configurações de provedores. Caso haja arquivos futuramente, definir preservação separada.
- Restauração no mesmo projeto perde dados posteriores ao backup e reverte a estrutura. Fazer exportação prévia; não usá-la como teste sem autorização específica.
- Se não houver ambiente viável para o ensaio, essa etapa permanece bloqueada e nenhum dado real é autorizado.

## Etapa 3 — expansão gradual

Somente após aprovação dos testes da etapa 1 e do procedimento de recuperação:

1. Integrantes e ficha familiar.
2. Demandas, atendimentos e encaminhamentos; notas confidenciais em estrutura separada com suas próprias concessões.
3. Modalidades, turmas, matrículas e frequência, preservando regras e relações atuais.
4. Relatórios e exportações com as mesmas restrições de acesso.

Mapa e endereço detalhado ficam fora desta autorização inicial. Cada bloco recebe validação e revisão de saldo próprias.

## Arquivos afetados na implementação futura

- `src/data/repository.ts` e `src/data/types.ts`: acesso assíncrono e tipos, mantendo os exemplos em `src/data/demo.ts`.
- `src/components/FamiliaForm.tsx`: salvamento efetivo e falhas de permissão.
- `src/components/AppShell.tsx`, `src/routes/__root.tsx` e, se necessário, `src/router.tsx`: sessão, navegação e saída sem mudanças visuais.
- Rotas existentes de famílias e administração: consultas, gestão autorizada e arquivamento; demais rotas mudam apenas de localização para proteção quando necessário, sem perda de endereço ou conteúdo.
- Novas rotas públicas de entrada e recuperação; funções privadas de acesso e persistência; migrações e testes focados.
- `src/start.ts`: preservar a proteção contra requisições indevidas e o envio de sessão existentes; ajustar somente se necessário.
- `AGENTS.md` e `roadmap.md`: atualizar regras e tarefas quando começar a implementação. Arquivos gerados de integração não serão editados manualmente.

## Riscos e controle de consumo

- Consultas hoje síncronas exigem adaptação cuidadosa para evitar listas vazias, erros de navegação e duplicidade incompleta.
- Mudança para rotas protegidas pode causar conflitos de endereço ou ciclos de entrada; testar navegação e atualização direta.
- Permissões amplas por conveniência podem expor dados; negar por padrão e testar chamadas diretas.
- Famílias reais e relações fictícias não são intercambiáveis; manter origem explícita e demonstrativos isolados.
- Economizar créditos reaproveitando telas, controles, integração Cloud e testes; evitar geração de imagens, instalações desnecessárias e reescritas gerais.
- Não há estimativa garantida de créditos por bloco. O saldo atual não autoriza execução automática de toda a proposta.

**Próxima ação:** aguardar autorização deste plano; depois confirmar os dados de perfil, a matriz de acesso e o primeiro administrador antes do bloco 1A/1B. Nenhum outro módulo será integrado automaticamente.
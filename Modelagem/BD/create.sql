/* ---------------------------------------------------------------------- */
/* Script generated with: DeZign for Databases V8.1.2                     */
/* Target DBMS:           Oracle 11g                                      */
/* Project file:          Modelo.dez                                      */
/* Project name:                                                          */
/* Author:                                                                */
/* Script type:           Database creation script                        */
/* Created on:            2026-04-11 16:20                                */
/* ---------------------------------------------------------------------- */


/* ---------------------------------------------------------------------- */
/* Add sequences                                                          */
/* ---------------------------------------------------------------------- */

CREATE SEQUENCE SEQ_USERS
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999999999
    nocycle
    noorder;

CREATE SEQUENCE SEQ_ADDRESS
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999999999
    nocycle
    noorder;

CREATE SEQUENCE SEQ_CONTACT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999999999
    nocycle
    noorder;

CREATE SEQUENCE SEQ_PRODUCT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999999999
    nocycle
    noorder;

CREATE SEQUENCE SEQ_CART
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999999999
    nocycle
    noorder;

CREATE SEQUENCE SEQ_CONVERSA
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999999999
    nocycle
    noorder;

CREATE SEQUENCE SEQ_MENSAGEM
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999999999
    nocycle
    noorder;

CREATE SEQUENCE SEQ_PEDIDO
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999999999
    nocycle
    noorder;

CREATE SEQUENCE SEQ_ITEM_PEDIDO
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999999999
    nocycle
    noorder;

CREATE SEQUENCE SEQ_AVALIACAO
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999999999
    nocycle
    noorder;

CREATE SEQUENCE SEQ_PERGUNTA
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999999999
    nocycle
    noorder;

/* ---------------------------------------------------------------------- */
/* Add tables                                                             */
/* ---------------------------------------------------------------------- */

/* ---------------------------------------------------------------------- */
/* Add table "USERS"                                                      */
/* ---------------------------------------------------------------------- */

CREATE TABLE USERS (
    ID_USER NUMBER(9) CONSTRAINT NN_USERS_ID_USER NOT NULL,
    NOME VARCHAR2(150) CONSTRAINT NN_USERS_NOME NOT NULL,
    EMAIL VARCHAR2(255) CONSTRAINT NN_USERS_EMAIL NOT NULL,
    SENHA VARCHAR2(255) CONSTRAINT NN_USERS_SENHA NOT NULL,
    ROLE NUMBER(1) DEFAULT 2 CONSTRAINT NN_USERS_ROLE NOT NULL,
    DATACADASTRO DATE CONSTRAINT NN_USERS_DATACADASTRO NOT NULL,
    ATIVO NUMBER,
    CPF VARCHAR2(11) CONSTRAINT NN_USERS_CPF NOT NULL,
    CONSTRAINT PK_USERS PRIMARY KEY (ID_USER)
);

/* ---------------------------------------------------------------------- */
/* Add table "CONTACT"                                                    */
/* ---------------------------------------------------------------------- */

CREATE TABLE CONTACT (
    ID_CONTACT NUMBER(9) CONSTRAINT NN_CONTACT_ID_CONTACT NOT NULL,
    NUMERO VARCHAR2(11) CONSTRAINT NN_CONTACT_NUMERO NOT NULL,
    ID_USER NUMBER(9),
    CONSTRAINT PK_CONTACT PRIMARY KEY (ID_CONTACT)
);

/* ---------------------------------------------------------------------- */
/* Add table "ADDRESS"                                                    */
/* ---------------------------------------------------------------------- */

CREATE TABLE ADDRESS (
    ID_ADDRESS NUMBER(9) CONSTRAINT NN_ADDRESS_ID_ADDRESS NOT NULL,
    RUA VARCHAR2(50) CONSTRAINT NN_ADDRESS_RUA NOT NULL,
    NUMERO VARCHAR2(40) CONSTRAINT NN_ADDRESS_NUMERO NOT NULL,
    COMPLEMENTO VARCHAR2(100),
    CIDADE VARCHAR2(40) CONSTRAINT NN_ADDRESS_CIDADE NOT NULL,
    ESTADO VARCHAR2(40) CONSTRAINT NN_ADDRESS_ESTADO NOT NULL,
    CEP VARCHAR2(40),
    ID_USER NUMBER(9),
    CONSTRAINT PK_ADDRESS PRIMARY KEY (ID_ADDRESS)
);

/* ---------------------------------------------------------------------- */
/* Add table "PRODUCT"                                                    */
/* ---------------------------------------------------------------------- */

CREATE TABLE PRODUCT (
    ID_PRODUTO NUMBER(9) CONSTRAINT NN_PRODUCT_ID_PRODUTO NOT NULL,
    DESCRICAO VARCHAR2(255),
    PRECO NUMBER(9,2),
    CATEGORIA VARCHAR2(255),
    QUANTIDADE NUMBER(9),
    IMAGEM VARCHAR2(255),
    DESCRICAO_DETALHADA VARCHAR2(4000),
    IMAGENS VARCHAR2(2000),
    CONSTRAINT PK_PRODUCT PRIMARY KEY (ID_PRODUTO)
);

/* ---------------------------------------------------------------------- */
/* Add table "CART"                                                       */
/* ---------------------------------------------------------------------- */

CREATE TABLE CART (
    ID_CART NUMBER(9) CONSTRAINT NN_CART_ID_CART NOT NULL,
    ID_USER NUMBER(9),
    ID_PRODUTO NUMBER(9),
    QUANTIDADE NUMBER(9) DEFAULT 1,
    DATAADICAO DATE,
    CONSTRAINT PK_CART PRIMARY KEY (ID_CART)
);

/* ---------------------------------------------------------------------- */
/* Add table "CONVERSA"                                                   */
/* ---------------------------------------------------------------------- */

CREATE TABLE CONVERSA (
    ID NUMBER(9) CONSTRAINT NN_CONVERSA_ID NOT NULL,
    NOME_CLIENTE VARCHAR2(200) CONSTRAINT NN_CONVERSA_NOME_CLIENTE NOT NULL,
    CLIENTE_ID NUMBER(9),
    STATUS VARCHAR2(20) CONSTRAINT NN_CONVERSA_STATUS NOT NULL,
    CRIADO_EM TIMESTAMP CONSTRAINT NN_CONVERSA_CRIADO_EM NOT NULL,
    CONSTRAINT PK_CONVERSA PRIMARY KEY (ID)
);

/* ---------------------------------------------------------------------- */
/* Add table "MENSAGEM"                                                   */
/* ---------------------------------------------------------------------- */

CREATE TABLE MENSAGEM (
    ID NUMBER(9) CONSTRAINT NN_MENSAGEM_ID NOT NULL,
    CONVERSA_ID NUMBER(9) CONSTRAINT NN_MENSAGEM_CONVERSA_ID NOT NULL,
    CONTEUDO VARCHAR2(4000) CONSTRAINT NN_MENSAGEM_CONTEUDO NOT NULL,
    REMETENTE_TIPO VARCHAR2(20) CONSTRAINT NN_MENSAGEM_REMETENTE_TIPO NOT NULL,
    REMETENTE_NOME VARCHAR2(200) CONSTRAINT NN_MENSAGEM_REMETENTE_NOME NOT NULL,
    ENVIADO_EM TIMESTAMP CONSTRAINT NN_MENSAGEM_ENVIADO_EM NOT NULL,
    CONSTRAINT PK_MENSAGEM PRIMARY KEY (ID)
);

/* ---------------------------------------------------------------------- */
/* Add table "PEDIDO"                                                     */
/* ---------------------------------------------------------------------- */

CREATE TABLE PEDIDO (
    ID NUMBER(9) CONSTRAINT NN_PEDIDO_ID NOT NULL,
    ID_USER NUMBER(9) CONSTRAINT NN_PEDIDO_ID_USER NOT NULL,
    ID_ADDRESS NUMBER(9),
    STATUS VARCHAR2(20) CONSTRAINT NN_PEDIDO_STATUS NOT NULL,
    DATA_PEDIDO TIMESTAMP CONSTRAINT NN_PEDIDO_DATA_PEDIDO NOT NULL,
    TOTAL NUMBER(9,2) CONSTRAINT NN_PEDIDO_TOTAL NOT NULL,
    CONSTRAINT PK_PEDIDO PRIMARY KEY (ID)
);

/* ---------------------------------------------------------------------- */
/* Add table "ITEM_PEDIDO"                                                */
/* ---------------------------------------------------------------------- */

CREATE TABLE ITEM_PEDIDO (
    ID NUMBER(9) CONSTRAINT NN_ITEM_PEDIDO_ID NOT NULL,
    ID_PEDIDO NUMBER(9) CONSTRAINT NN_ITEM_PEDIDO_ID_PEDIDO NOT NULL,
    ID_PRODUTO NUMBER(9) CONSTRAINT NN_ITEM_PEDIDO_ID_PRODUTO NOT NULL,
    QUANTIDADE NUMBER(5) CONSTRAINT NN_ITEM_PEDIDO_QUANTIDADE NOT NULL,
    PRECO_UNITARIO NUMBER(9,2) CONSTRAINT NN_ITEM_PEDIDO_PRECO_UNITARIO NOT NULL,
    CONSTRAINT PK_ITEM_PEDIDO PRIMARY KEY (ID)
);

/* ---------------------------------------------------------------------- */
/* Add table "CONFIGURACAO"                                               */
/* ---------------------------------------------------------------------- */

CREATE TABLE CONFIGURACAO (
    ID NUMBER(9) CONSTRAINT NN_CONFIGURACAO_ID NOT NULL,
    NOME VARCHAR2(100) CONSTRAINT NN_CONFIGURACAO_NOME NOT NULL,
    DESCRICAO VARCHAR2(500),
    EMAIL VARCHAR2(100),
    TELEFONE VARCHAR2(20),
    WHATSAPP VARCHAR2(20),
    FRETE_GRATIS_ACIMA NUMBER(10,2),
    LOGO_URL VARCHAR2(500),
    CONSTRAINT PK_CONFIGURACAO PRIMARY KEY (ID)
);

/* ---------------------------------------------------------------------- */
/* Add table "PERGUNTA"                                                   */
/* ---------------------------------------------------------------------- */

CREATE TABLE PERGUNTA (
    ID          NUMBER(9)      NOT NULL,
    ID_PRODUTO  NUMBER(9)      NOT NULL,
    ID_USER     NUMBER(9),
    TEXTO       VARCHAR2(2000) NOT NULL,
    RESPOSTA    VARCHAR2(2000),
    RESPONDIDO_EM TIMESTAMP,
    CRIADO_EM   TIMESTAMP      NOT NULL,
    CONSTRAINT PK_PERGUNTA PRIMARY KEY (ID)
);

/* ---------------------------------------------------------------------- */
/* Add table "AVALIACAO"                                                  */
/* ---------------------------------------------------------------------- */

CREATE TABLE AVALIACAO (
    ID          NUMBER(9)     CONSTRAINT NN_AVALIACAO_ID NOT NULL,
    ID_PRODUTO  NUMBER(9)     CONSTRAINT NN_AVALIACAO_ID_PRODUTO NOT NULL,
    ID_USER     NUMBER(9)     CONSTRAINT NN_AVALIACAO_ID_USER NOT NULL,
    NOTA        NUMBER(1)     CONSTRAINT NN_AVALIACAO_NOTA NOT NULL,
    COMENTARIO  VARCHAR2(1000),
    CRIADO_EM   TIMESTAMP     CONSTRAINT NN_AVALIACAO_CRIADO_EM NOT NULL,
    CONSTRAINT PK_AVALIACAO PRIMARY KEY (ID),
    CONSTRAINT UQ_AVAL_USER_PRODUTO UNIQUE (ID_USER, ID_PRODUTO),
    CONSTRAINT CK_AVAL_NOTA CHECK (NOTA BETWEEN 1 AND 5)
);

/* ---------------------------------------------------------------------- */
/* Add foreign key constraints                                            */
/* ---------------------------------------------------------------------- */

ALTER TABLE CONTACT ADD CONSTRAINT USERS_CONTACT 
    FOREIGN KEY (ID_USER) REFERENCES USERS (ID_USER);

ALTER TABLE ADDRESS ADD CONSTRAINT USERS_ADDRESS 
    FOREIGN KEY (ID_USER) REFERENCES USERS (ID_USER);

ALTER TABLE CART ADD CONSTRAINT USERS_CART 
    FOREIGN KEY (ID_USER) REFERENCES USERS (ID_USER);

ALTER TABLE CART ADD CONSTRAINT PRODUCT_CART 
    FOREIGN KEY (ID_PRODUTO) REFERENCES PRODUCT (ID_PRODUTO);

ALTER TABLE MENSAGEM ADD CONSTRAINT CONVERSA_MENSAGEM 
    FOREIGN KEY (CONVERSA_ID) REFERENCES CONVERSA (ID) ON DELETE CASCADE;

ALTER TABLE PEDIDO ADD CONSTRAINT USERS_PEDIDO 
    FOREIGN KEY (ID_USER) REFERENCES USERS (ID_USER) ON DELETE CASCADE;

ALTER TABLE PEDIDO ADD CONSTRAINT PEDIDO_ADDRESS
    FOREIGN KEY (ID_ADDRESS) REFERENCES ADDRESS (ID_ADDRESS);

ALTER TABLE ITEM_PEDIDO ADD CONSTRAINT PEDIDO_ITEM_PEDIDO 
    FOREIGN KEY (ID_PEDIDO) REFERENCES PEDIDO (ID) ON DELETE CASCADE;

ALTER TABLE ITEM_PEDIDO ADD CONSTRAINT PRODUCT_ITEM_PEDIDO
    FOREIGN KEY (ID_PRODUTO) REFERENCES PRODUCT (ID_PRODUTO) ON DELETE CASCADE;

ALTER TABLE AVALIACAO ADD CONSTRAINT FK_AVAL_PRODUTO
    FOREIGN KEY (ID_PRODUTO) REFERENCES PRODUCT (ID_PRODUTO) ON DELETE CASCADE;

ALTER TABLE AVALIACAO ADD CONSTRAINT FK_AVAL_USER
    FOREIGN KEY (ID_USER) REFERENCES USERS (ID_USER) ON DELETE CASCADE;

ALTER TABLE PERGUNTA ADD CONSTRAINT FK_PERG_PRODUTO
    FOREIGN KEY (ID_PRODUTO) REFERENCES PRODUCT (ID_PRODUTO) ON DELETE CASCADE;

ALTER TABLE PERGUNTA ADD CONSTRAINT FK_PERG_USER
    FOREIGN KEY (ID_USER) REFERENCES USERS (ID_USER) ON DELETE SET NULL;

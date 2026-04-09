/* ---------------------------------------------------------------------- */
/* Script generated with: DeZign for Databases V8.1.2                     */
/* Target DBMS:           Oracle 11g                                      */
/* Project file:          Modelo.dez                                      */
/* Project name:                                                          */
/* Author:                                                                */
/* Script type:           Database creation script                        */
/* Created on:            2026-04-09 16:50                                */
/* ---------------------------------------------------------------------- */


/* ---------------------------------------------------------------------- */
/* Add sequences                                                          */
/* ---------------------------------------------------------------------- */

CREATE SEQUENCE SEC_USERS
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999999999
    nocycle
    noorder;

CREATE SEQUENCE SEC_ADRESS
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999999999
    nocycle
    noorder;

CREATE SEQUENCE SEC_CONTACT
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
    ID_PRODUTO NUMBER CONSTRAINT NN_PRODUCT_ID_PRODUTO NOT NULL,
    DESCRICAO VARCHAR2(255),
    PRECO NUMBER(9,2),
    CATEGORIA VARCHAR2(255),
    QUANTIDADE NUMBER(9),
    IMAGEM VARCHAR2(255),
    CONSTRAINT PK_PRODUCT PRIMARY KEY (ID_PRODUTO)
);

/* ---------------------------------------------------------------------- */
/* Add foreign key constraints                                            */
/* ---------------------------------------------------------------------- */

ALTER TABLE CONTACT ADD CONSTRAINT USERS_CONTACT 
    FOREIGN KEY (ID_USER) REFERENCES USERS (ID_USER);

ALTER TABLE ADDRESS ADD CONSTRAINT USERS_ADDRESS 
    FOREIGN KEY (ID_USER) REFERENCES USERS (ID_USER);

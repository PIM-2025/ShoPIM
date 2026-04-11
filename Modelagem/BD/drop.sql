/* ---------------------------------------------------------------------- */
/* Script generated with: DeZign for Databases V8.1.2                     */
/* Target DBMS:           Oracle 11g                                      */
/* Project file:          Modelo.dez                                      */
/* Project name:                                                          */
/* Author:                                                                */
/* Script type:           Database drop script                            */
/* Created on:            2026-04-11 10:40                                */
/* ---------------------------------------------------------------------- */


/* ---------------------------------------------------------------------- */
/* Drop foreign key constraints                                           */
/* ---------------------------------------------------------------------- */

ALTER TABLE CONTACT DROP CONSTRAINT USERS_CONTACT;

ALTER TABLE ADDRESS DROP CONSTRAINT USERS_ADDRESS;

ALTER TABLE CART DROP CONSTRAINT USERS_CART;

ALTER TABLE CART DROP CONSTRAINT PRODUCT_CART;

ALTER TABLE MENSAGEM DROP CONSTRAINT CONVERSA_MENSAGEM;

/* ---------------------------------------------------------------------- */
/* Drop table "MENSAGEM"                                                  */
/* ---------------------------------------------------------------------- */

/* Drop constraints */

ALTER TABLE MENSAGEM DROP CONSTRAINT NN_MENSAGEM_ID;

ALTER TABLE MENSAGEM DROP CONSTRAINT NN_MENSAGEM_CONVERSA_ID;

ALTER TABLE MENSAGEM DROP CONSTRAINT NN_MENSAGEM_CONTEUDO;

ALTER TABLE MENSAGEM DROP CONSTRAINT NN_MENSAGEM_REMETENTE_TIPO;

ALTER TABLE MENSAGEM DROP CONSTRAINT NN_MENSAGEM_REMETENTE_NOME;

ALTER TABLE MENSAGEM DROP CONSTRAINT NN_MENSAGEM_ENVIADO_EM;

ALTER TABLE MENSAGEM DROP CONSTRAINT PK_MENSAGEM;

DROP TABLE MENSAGEM;

/* ---------------------------------------------------------------------- */
/* Drop table "CONVERSA"                                                  */
/* ---------------------------------------------------------------------- */

/* Drop constraints */

ALTER TABLE CONVERSA DROP CONSTRAINT NN_CONVERSA_ID;

ALTER TABLE CONVERSA DROP CONSTRAINT NN_CONVERSA_NOME_CLIENTE;

ALTER TABLE CONVERSA DROP CONSTRAINT NN_CONVERSA_STATUS;

ALTER TABLE CONVERSA DROP CONSTRAINT NN_CONVERSA_CRIADO_EM;

ALTER TABLE CONVERSA DROP CONSTRAINT PK_CONVERSA;

DROP TABLE CONVERSA;

/* ---------------------------------------------------------------------- */
/* Drop table "CART"                                                      */
/* ---------------------------------------------------------------------- */

/* Drop constraints */

ALTER TABLE CART DROP CONSTRAINT NN_CART_ID_CART;

ALTER TABLE CART DROP CONSTRAINT PK_CART;

DROP TABLE CART;

/* ---------------------------------------------------------------------- */
/* Drop table "PRODUCT"                                                   */
/* ---------------------------------------------------------------------- */

/* Drop constraints */

ALTER TABLE PRODUCT DROP CONSTRAINT NN_PRODUCT_ID_PRODUTO;

ALTER TABLE PRODUCT DROP CONSTRAINT PK_PRODUCT;

DROP TABLE PRODUCT;

/* ---------------------------------------------------------------------- */
/* Drop table "ADDRESS"                                                   */
/* ---------------------------------------------------------------------- */

/* Drop constraints */

ALTER TABLE ADDRESS DROP CONSTRAINT NN_ADDRESS_ID_ADDRESS;

ALTER TABLE ADDRESS DROP CONSTRAINT NN_ADDRESS_RUA;

ALTER TABLE ADDRESS DROP CONSTRAINT NN_ADDRESS_NUMERO;

ALTER TABLE ADDRESS DROP CONSTRAINT NN_ADDRESS_CIDADE;

ALTER TABLE ADDRESS DROP CONSTRAINT NN_ADDRESS_ESTADO;

ALTER TABLE ADDRESS DROP CONSTRAINT PK_ADDRESS;

DROP TABLE ADDRESS;

/* ---------------------------------------------------------------------- */
/* Drop table "CONTACT"                                                   */
/* ---------------------------------------------------------------------- */

/* Drop constraints */

ALTER TABLE CONTACT DROP CONSTRAINT NN_CONTACT_ID_CONTACT;

ALTER TABLE CONTACT DROP CONSTRAINT NN_CONTACT_NUMERO;

ALTER TABLE CONTACT DROP CONSTRAINT PK_CONTACT;

DROP TABLE CONTACT;

/* ---------------------------------------------------------------------- */
/* Drop table "USERS"                                                     */
/* ---------------------------------------------------------------------- */

/* Drop constraints */

ALTER TABLE USERS DROP CONSTRAINT NN_USERS_ID_USER;

ALTER TABLE USERS DROP CONSTRAINT NN_USERS_NOME;

ALTER TABLE USERS DROP CONSTRAINT NN_USERS_EMAIL;

ALTER TABLE USERS DROP CONSTRAINT NN_USERS_SENHA;

ALTER TABLE USERS DROP CONSTRAINT NN_USERS_ROLE;

ALTER TABLE USERS DROP CONSTRAINT NN_USERS_DATACADASTRO;

ALTER TABLE USERS DROP CONSTRAINT NN_USERS_CPF;

ALTER TABLE USERS DROP CONSTRAINT PK_USERS;

DROP TABLE USERS;

/* ---------------------------------------------------------------------- */
/* Drop sequences                                                         */
/* ---------------------------------------------------------------------- */

DROP SEQUENCE SEQ_USERS;

DROP SEQUENCE SEQ_ADRESS;

DROP SEQUENCE SEQ_CONTACT;

DROP SEQUENCE SEQ_PRODUCT;

DROP SEQUENCE SEQ_CART;

DROP SEQUENCE SEQ_CONVERSA;

DROP SEQUENCE SEQ_MENSAGEM;

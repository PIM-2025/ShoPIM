/* ---------------------------------------------------------------------- */
/* Script generated with: DeZign for Databases V8.1.2                     */
/* Target DBMS:           Oracle 11g                                      */
/* Project file:          Modelo.dez                                      */
/* Project name:                                                          */
/* Author:                                                                */
/* Script type:           Database drop script                            */
/* Created on:            2026-04-09 16:50                                */
/* ---------------------------------------------------------------------- */


/* ---------------------------------------------------------------------- */
/* Drop foreign key constraints                                           */
/* ---------------------------------------------------------------------- */

ALTER TABLE CONTACT DROP CONSTRAINT USERS_CONTACT;

ALTER TABLE ADDRESS DROP CONSTRAINT USERS_ADDRESS;

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

DROP SEQUENCE SEC_USERS;

DROP SEQUENCE SEC_ADRESS;

DROP SEQUENCE SEC_CONTACT;

DROP SEQUENCE SEQ_PRODUCT;

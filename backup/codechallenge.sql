--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2
-- Dumped by pg_dump version 12.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: tbl_departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_departments (
    department_id integer NOT NULL,
    department_name text,
    department_status boolean DEFAULT false
);


ALTER TABLE public.tbl_departments OWNER TO postgres;

--
-- Name: tbl_departments_department_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_departments_department_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_departments_department_id_seq OWNER TO postgres;

--
-- Name: tbl_departments_department_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tbl_departments_department_id_seq OWNED BY public.tbl_departments.department_id;


--
-- Name: tbl_employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_employees (
    employee_id text DEFAULT public.uuid_generate_v4() NOT NULL,
    employee_lastname text,
    employee_firstname text,
    employee_status boolean DEFAULT false,
    role_id integer DEFAULT 3,
    team_id integer
);


ALTER TABLE public.tbl_employees OWNER TO postgres;

--
-- Name: tbl_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_roles (
    role_id integer NOT NULL,
    role_name text,
    role_status boolean DEFAULT false
);


ALTER TABLE public.tbl_roles OWNER TO postgres;

--
-- Name: tbl_teams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_teams (
    team_id integer NOT NULL,
    team_name text,
    team_status boolean DEFAULT false,
    department_id integer
);


ALTER TABLE public.tbl_teams OWNER TO postgres;

--
-- Name: tbl_teams_team_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_teams_team_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_teams_team_id_seq OWNER TO postgres;

--
-- Name: tbl_teams_team_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tbl_teams_team_id_seq OWNED BY public.tbl_teams.team_id;


--
-- Name: tbl_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_users (
    user_id text DEFAULT public.uuid_generate_v4() NOT NULL,
    user_username text,
    user_password text,
    user_salt text,
    user_iteration integer,
    user_status boolean DEFAULT false,
    user_email text,
    user_fullname text,
    user_permission_code character(2) DEFAULT '01'::bpchar
);


ALTER TABLE public.tbl_users OWNER TO postgres;

--
-- Name: tbl_departments department_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_departments ALTER COLUMN department_id SET DEFAULT nextval('public.tbl_departments_department_id_seq'::regclass);


--
-- Name: tbl_teams team_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_teams ALTER COLUMN team_id SET DEFAULT nextval('public.tbl_teams_team_id_seq'::regclass);


--
-- Data for Name: tbl_departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_departments (department_id, department_name, department_status) FROM stdin;
1	Department 1	f
2	Department 2	f
3	Department 3	f
\.


--
-- Data for Name: tbl_employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_employees (employee_id, employee_lastname, employee_firstname, employee_status, role_id, team_id) FROM stdin;
ea26055b-74a5-4b94-a858-29b90c19128e	Nguyen	Khang	f	1	\N
9841049e-41a1-443b-be8b-6160df1ee730	Tran	A	f	2	1
abb40bc6-ba29-43db-a424-1a8de5afce28	Dinh	B	f	3	1
ceed9ccb-4ff1-4fe1-95f0-ddbfb56b46bd	Hoang	C	f	2	3
d831c3ae-69de-477b-af4a-dca7e8d9d24b	Dinh	D	f	3	3
9f802f0f-63d9-4ea2-8296-17af4d1f05ca	Dang	F	f	3	3
062ba9ac-ac7f-47cc-a923-3f7d99058842	Nguyen	G	f	3	3
cff0fabe-e228-4a35-8cb8-e2fc8363ebf0	Le	H	f	2	4
3c31f318-5332-4bf4-82f3-34021622accb	Pham	IUpdate	t	3	5
\.


--
-- Data for Name: tbl_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_roles (role_id, role_name, role_status) FROM stdin;
1	President	f
2	Manager	f
3	Member	f
\.


--
-- Data for Name: tbl_teams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_teams (team_id, team_name, team_status, department_id) FROM stdin;
1	Team 1	f	1
3	Team 3	f	3
5	Team 5	f	3
2	Team 2	f	2
6	Team 6	f	3
4	Team 4	f	2
\.


--
-- Data for Name: tbl_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_users (user_id, user_username, user_password, user_salt, user_iteration, user_status, user_email, user_fullname, user_permission_code) FROM stdin;
7d61a4a1-3826-4fd9-b5d6-8b84433abd46	admin	1589534670162$10$77992cc653f8f6335e65e5c324d78cc3	1589534670162	10	f	testadmin@test.com	Manh Khang	99
1f77a4a1-3826-4fd9-b5d1-8b82533abd50	test1	1589534670162$10$77992cc653f8f6335e65e5c324d78cc3	1589534670162	10	f	testuser@test.com	Test 1	11
\.


--
-- Name: tbl_departments_department_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_departments_department_id_seq', 1, false);


--
-- Name: tbl_teams_team_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_teams_team_id_seq', 6, true);


--
-- Name: tbl_departments tbl_departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_departments
    ADD CONSTRAINT tbl_departments_pkey PRIMARY KEY (department_id);


--
-- Name: tbl_employees tbl_employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_employees
    ADD CONSTRAINT tbl_employees_pkey PRIMARY KEY (employee_id);


--
-- Name: tbl_roles tbl_role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_roles
    ADD CONSTRAINT tbl_role_pkey PRIMARY KEY (role_id);


--
-- Name: tbl_teams tbl_teams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_teams
    ADD CONSTRAINT tbl_teams_pkey PRIMARY KEY (team_id);


--
-- Name: tbl_users tbl_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_users
    ADD CONSTRAINT tbl_users_pkey PRIMARY KEY (user_id);


--
-- Name: tbl_users unique_username_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_users
    ADD CONSTRAINT unique_username_email UNIQUE (user_email, user_username);


--
-- PostgreSQL database dump complete
--


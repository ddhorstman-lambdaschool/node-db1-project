-- Database Queries
-- Find all customers with postal code 1010

SELECT *
FROM Customers
WHERE postal_code='1010';

-- Find the phone number for the supplier with the id 11

SELECT Phone
FROM Suppliers
WHERE supplier_id='11';

-- List first 10 orders placed, sorted descending by the order date

SELECT *
FROM Orders
ORDER BY order_date DESC
LIMIT 10;

-- Find all customers that live in London, Madrid, or Brazil

SELECT *
FROM Customers
WHERE city='London'
  OR city='Madrid'
  OR country='Brazil';

-- Add a customer record for "The Shire", the contact name is "Bilbo Baggins"
--the address is -"1 Hobbit-Hole" in "Bag End", postal code "111"
--and the country is "Middle Earth"
 -- INSERT INTO Customers (customer_id, company_name, contact_name, address, city, postal_code, country)
-- VALUES (92,
--         'The Shire',
--         'Bilbo Baggins',
--         '1 Hobbit-Hole',
--         'Bag End',
--         '111',
--         'Middle Earth');
-- NOTE: This database has its primary key configured incorrectly, so it has to be manually added
-- I wasn't able to fix it.

-- Update Bilbo Baggins record so that the postal code changes to "11122"
 
UPDATE Customers
SET postal_code='11122' 
WHERE company_name='The Shire';

-- (Stretch) Find a query to discover how many different cities are stored in the Customers table. Repeats should not be double counted

SELECT Count (DISTINCT city)
FROM Customers;

-- (Stretch) Find all suppliers who have names longer than 20 characters. You can use `length(SupplierName)` to get the length of the name

SELECT *
from Suppliers
WHERE length(company_name) > 20;
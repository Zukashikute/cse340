-- Data for table `account` 
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Update info for Tony Stark
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

-- Delete info of Tony Stark
DELETE FROM public.account
WHERE account_id = 1;

-- Modifying GM HUMMER info
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'huge interiors' )
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Selecting inv_make and inv_model from a join table
SELECT inv_make, inv_model
FROM inventory i
INNER JOIN classification c
ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- Updating file path for inventory table
UPDATE public.inventory
SET inv_image = CONCAT(
      SUBSTRING(
         inv_image
         FROM 1 FOR 7
      ),
      '/vehicles',
      SUBSTRING(
         inv_image
         FROM 8
      )
   ),
   inv_thumbnail = CONCAT(
      SUBSTRING(
         inv_thumbnail
         FROM 1 FOR 7
      ),
      '/vehicles',
      SUBSTRING(
         inv_thumbnail
         FROM 8
      )
   );
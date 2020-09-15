# salePlatform

### User Story

Have you ever camped on a website for a product drop - sneakers, watches, bakes - only to find that when the moment came and the product dropped, you fumbled with the website and shopping cart, or were held up by entering credit card details that by the time you tried to purchase it, it was all sold out? 

Presenting Hayaku, a streamlined e-commerce platform that aims to fix exactly that. Hayaku is a one-stop platform where product enthusiasts can track all the product drops they want and conduct the entire purchase process - product selection, order confirmation and order submission on the same page. In practice, it would be ideal if a one-click purchase method similar to Amazon's 1-click ordering could be implemented. 

But for SEI's project 2 requirements, it's enough to know the technology exists. I didn't implement any transaction technology. I kept this project to strictly database CRUD operations.

### Database Structure

For the MVP, I wanted there to be two types of users - sellers and buyers. These would be distinct (ie a user cannot be both a seller and a buyer on the same account), because what each of them would need from the sale platform, and what the platform would require from them, is very different. So two tables - *sellers* and *buyers*.

A seller would be able to add items to their catalogue, and edit those items. So we need a table for the items available on the website - *catalogue*.

Sellers could also create sales. For sales that had not gone live yet, they'd be able to edit or delete the sale. If the sale had already gone live, it's not fair to buyers if the seller can edit or delete the sale, and a record of the sale is required for purchases that have already been made - so the seller has the option to close the sale. So we'd need a table for *sales*. 

A buyer would be able to track and untrack individual sales. They could also follow all of a seller's upcoming and live sales by tracking a seller. If the seller creates a new sale, the buyer's tracked sales is updated to include the new sale. So two tables - *seller_tracker* which maps the tracking relations between buyers and sellers and *sale_tracker*, which does the same for individual sales.

For the sales themselves, I thought it would be more speed efficient if every sale had its own table, so there's fewer rows to select from every time a user makes a purchase. So when a sale is created, a new table is made as well - that might not be very storage efficient, though, especially because the table can't be dropped once the sale goes live. 

I'd also need a way to track orders. But each order might have multiple items. To keep it neat, I split the orders information into two tables - orders and order_details. *orders* contains information (order_id, the sale, the seller, the buyer, time of order) on each order, while *order_details* maps the items made in each order, and the amount paid per order to the order_id.

So a database of 8 tables total: *sellers*, *buyers*, *catalogue*, *sales*, *seller_tracker*, *sale_tracker*, *orders* and *order_details*. And an additional new table for each sale - but I'm not sure I'd keep it that way if I did this project over again.

### Wireframing and User Flow

I'm not great at design so I didn't work with wireframes as much as the information I wanted on the page. I knew the dashboards would work well as a set of tables with links directly to relevant sales/sellers. 

To make the experience as seamless as possible, I wanted to make everything accessible from the dashboard. So for buyers, links to live sales and sale waiting rooms would be in the table of all their tracked sales. For sellers, they could directly go to edit forms for their sales/catalogue from their dashboards. 

I added in seller/sale browsing pages pretty late in the process, and the week was up before I could make any improvements. Ideally, while those browse pages could still exist, I think the browse could be more tailored to user interests (which would be another column in the buyers table). Additionally, a search bar that could take user input to query sales, sellers and items and return those results would be great and definitely something I'd implement.

### Challenges

Scope creep was a bit of an issue for me. I wanted my app to have a lot of functionality, and this led to me feeling strained during the project and somewhat burnt out afterwards. 

I didn't fully understand that queries were promises, so my start-of-the-week coding was kind of messy. As I kept coding (and discovered Promise.all) my coding got cleaner. I'm still not sure where to catch errors though.

Again, not sure about creating separate tables for each sale. Will have to look into that.

Authentication - lots of different ways to hack the platform from the front end, and you really don't want that in an ecommerce app where drop times, maximum orders, items available etc are rules that have to be strictly followed.

### Furthers

If/when I come back to this, I'll add more back-end checks to ensure that people aren't trying to game the system. I'd also add the option to archive items if sellers don't want the items to be available on the catalogue - I don't think deleting the item would work because a record is required for past orders. The search function would also really improve user experience. A chat function between buyers and sellers would also be great, as well as an option for delivery on sales.
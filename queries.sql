-- Sample analytical queries against the fictional SQLite database.
SELECT category,COUNT(*) AS products,ROUND(AVG(price_cents)/100.0,2) AS avg_price_usd
FROM products WHERE active=1 GROUP BY category ORDER BY category;

SELECT o.id AS demo_order_id,
       o.status,
       ROUND(SUM(p.price_cents*i.quantity)/100.0,2) AS subtotal_usd
FROM demo_orders o JOIN demo_order_items i ON i.order_id=o.id
JOIN products p ON p.id=i.product_id
GROUP BY o.id, o.status ORDER BY o.id;

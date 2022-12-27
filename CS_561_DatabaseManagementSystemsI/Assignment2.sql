-- Yufu Liao
-- 10478967

-- query 1
with avg as (
    select cust, prod, month, avg(quant)
    from sales
    group by cust, prod, month
    order by cust, prod, month
)
select cust as customer, prod as product, month, 
case when month=1 or month=12 then null else (
    select count(*) as SALES_COUNT_BETWEEN_AVGS
    from sales
    where cur.cust=sales.cust and cur.prod=sales.prod and cur.month=sales.month and
    sales.quant between (
        select min(avg.avg)
        from avg
        where sales.cust=avg.cust and sales.prod=avg.prod and (
            sales.month=avg.month-1 or sales.month=avg.month+1
        )
    ) and (
        select max(avg.avg)
        from avg
        where sales.cust=avg.cust and sales.prod=avg.prod and (
            sales.month=avg.month-1 or sales.month=avg.month+1
        )
    )
) end
from avg as cur


-- query 2
with q_avg as (
    select cust, prod, month, round(avg(quant)) as avg_m
    from sales
    group by cust, prod, month
)
select cust as customer, prod as product, month,
case when month=1 then null else 
(
    select avg_m 
    from q_avg 
    where cur.cust=q_avg.cust and cur.prod=q_avg.prod and cur.month=q_avg.month+1
) end as BEFORE_AVG,
avg_m as DURING_AVG,
case when month=12 then null else 
(
    select avg_m 
    from q_avg 
    where cur.cust=q_avg.cust and cur.prod=q_avg.prod and cur.month=q_avg.month-1
) end as AFTER_AVG
from q_avg as cur
order by cust, prod, month


-- query 3
with part as (
    select cust, prod, state, round(avg(quant)) as PROD_AVG
    from sales
    group by cust, prod, state
),
part2 as (
    select cust, prod, state, PROD_AVG, (
        select round(avg(quant)) as OTHER_CUST_AVG
        from sales
        where part.cust!=sales.cust and part.prod=sales.prod and part.state=sales.state
    )
    from part
),
part3 as (
    select cust, prod, state, PROD_AVG, OTHER_CUST_AVG, (
        select round(avg(quant)) as OTHER_PROD_AVG
        from sales
        where part2.cust=sales.cust and part2.prod!=sales.prod and part2.state=sales.state
    )
    from part2
)
select cust as customer, prod as product, state, PROD_AVG, OTHER_CUST_AVG, OTHER_PROD_AVG, (
    select round(avg(quant)) as OTHER_STATE_AVG
    from sales
    where part3.cust=sales.cust and part3.prod=sales.prod and part3.state!=sales.state
)
from part3


-- query 4
select cust as customer, quant as quantity, prod as product, date
from sales
where state='NJ' and quant in (
    select distinct quant
    from sales as top
    where top.state='NJ' and sales.cust=top.cust 
    order by top.quant desc
    limit 3
)
order by cust, quant desc



-- query 5
with part as (
    select cust, prod, sum(quant)/3 as sumyear
    from sales
    group by cust, prod
),
part2 as(
    select cust, prod, month
    from sales
    group by cust, prod, month
    order by cust, prod, month
)
select cust as customer, prod as product, min(month) as _1_3_PURCHASED_BY_MONTH
from part2
where (
    select sum(quant)
    from sales
    where part2.cust=sales.cust and part2.prod=sales.prod and part2.month>=sales.month
) >= (
    select sumyear
    from part
    where part2.cust=part.cust and part2.prod=part.prod
)
group by cust, prod
order by cust, prod
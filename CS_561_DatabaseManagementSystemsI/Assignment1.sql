-- Yufu Liao
-- 1078967


-- query #1
with part as(
    select 
        cust as CUSTOMER, min(quant) as MIN_Q, max(quant) as MAX_Q, round(avg(quant)) as AVG_Q
    from sales
    group by cust
),
part2 as(
    select CUSTOMER, MIN_Q, prod as MIN_PROD, date as MIN_DATE, state ST, MAX_Q, AVG_Q
    from sales join part
    on cust = customer AND quant = min_q
)
select 
    CUSTOMER, MIN_Q, MIN_PROD, MIN_DATE, ST, 
    MAX_Q, prod as MAX_PROD, date as MAX_DATE, state as ST, AVG_Q
from sales join part2
on cust = customer AND quant = MAX_Q
order by CUSTOMER, min_prod, max_prod;

-- query #2
with total as(
    select month, prod, sum(quant) as total
    from sales
    group by month, prod
),
maxmin as(
    select month, max(total) as MOST_POP_TOTAL_Q, min(total) as LEAST_POP_TOTAL_Q
    from total
    group by month
),
maxprod as(
    select total.month, prod as max_prod, MOST_POP_TOTAL_Q
    from total join maxmin
    on total.month = maxmin.month AND
    total.total = maxmin.MOST_POP_TOTAL_Q
),
minprod as(
    select total.month, prod as min_prod, LEAST_POP_TOTAL_Q
    from total join maxmin
    on total.month = maxmin.month AND
    total.total = maxmin.LEAST_POP_TOTAL_Q
)
select maxprod.month as month, max_prod as MOST_POPULAR_PROD, MOST_POP_TOTAL_Q,
min_prod as LEAST_POPULAR_PROD, LEAST_POP_TOTAL_Q
from maxprod join minprod
on maxprod.month = minprod.month
order by maxprod.month;


-- query #3
with part as(
    select prod, month, max(quant) as monthmax, min(quant) as monthmin
    from sales
    group by prod, month
),
part2 as(
    select prod, max(monthmax), min(monthmin)
    from part
    group by prod
),
part3 as(
    select part.prod, month as MOST_FAV_MO, min
    from part join part2
    on part.prod = part2.prod and
    part.monthmax = part2.max
)
select part.prod as product, MOST_FAV_MO, month as LEAST_FAV_MO
from part join part3
on part.prod = part3.prod and
part.monthmin = part3.min;

-- query #4
select cust as CUSTOMER, prod as PRODUCT, 
    sum(case when month between 1 and 3 then quant else 0 end)/sum(case when month between 1 and 3 then 1 else 0 end) as Q1_AVG,
    sum(case when month between 4 and 6 then quant else 0 end)/sum(case when month between 4 and 6 then 1 else 0 end) as Q2_AVG,
    sum(case when month between 7 and 9 then quant else 0 end)/sum(case when month between 7 and 9 then 1 else 0 end) as Q3_AVG,
    sum(case when month between 10 and 12 then quant else 0 end)/sum(case when month between 10 and 12 then 1 else 0 end) as Q4_AVG,
    round(avg(quant)) as average,
    sum(quant) as total,
    count(quant)
from sales
group by cust, prod;



-- query 5
with part as(
    select cust, prod, state, quant, date
    from sales
    where (cust, prod, state, quant) in (
        select cust, prod, state, max(quant)
        from sales
        where state in ( 'NY', 'NJ', 'CT')
        group by cust, prod, state
    )
)
select part2.cust as CUSTOMER, part2.prod as PRODUCT, part2.ny_max, part2.date, part3.nj_max, part3.date, part4.ct_max, part4.date
from 
(select cust, prod, quant as NY_MAX, date from part where state = 'NY') as part2,
(select cust, prod, quant as NJ_MAX, date from part where state = 'NJ') as part3,
(select cust, prod, quant as CT_MAX, date from part where state = 'CT') as part4
where 
part2.cust = part3.cust and part2.prod = part3.prod and
part3.cust = part4.cust and part3.prod = part4.prod and
(ny_max > nj_max or ny_max > ct_max);
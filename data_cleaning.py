import pandas as pd
import json

grant_data = pd.read_csv("C:/Users/Tom/Documents/GrantNav/homelessness.csv")
grant_data['YearMonth'] = pd.to_datetime(grant_data['Award Date']).map(lambda x: 100*x.year + x.month)

clean_grant_data = grant_data[['YearMonth', 'Funding Org:Name', 'Amount Awarded']]

total_awarded = clean_grant_data.sum()
print(total_awarded)

grouped = clean_grant_data.groupby('Funding Org:Name').sum().reset_index()
sorted = grouped.sort_values('Amount Awarded', ascending=False).reset_index().head(10)

top_10 = sorted['Funding Org:Name'].values
print (top_10)

others_data = clean_grant_data

mask = ~others_data['Funding Org:Name'].isin(top_10)
column_name = 'Funding Org:Name'
others_data.loc[mask, column_name] = 'Other'

print (others_data.head(10))


month_grouped = others_data.groupby(['YearMonth', 'Funding Org:Name']).sum().reset_index()
month_sorted = month_grouped.sort_values('YearMonth', ascending=True)

month_sorted.drop(month_sorted[month_sorted.YearMonth < 200800].index, inplace=True)
print (month_sorted.to_json(orient='records'))
incomplete_list = sorted['Funding Org:Name'].tolist()
incomplete_list.append("Other")
print(json.dumps(incomplete_list))
#grant_data['YearMonth'] = grant_data

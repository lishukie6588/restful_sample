# Stocks and Life Planner

- Summary:

  - This is a personal stocks and life planner browser-based application.
  - App URL: https://lishukie-portfolio-1.herokuapp.com/login?status=0
  - Users can create an account and access their account from any device.
  - For demonstration purpose, a pre-configured account is provided with the following login credentials:
    - username: userid1
    - password: password1
  - Please also feel free to create a new account if you prefer.
  
- Components:

  - Calendar planner:
    - create and modify daily todo lists in a calendar-format interface
    - navigate to the next or previous month, or jump to any specific month in any specific year
    - serves as a weather forecast widget:
      - weather details of user's specified city displayed for the next 14 days
    - servers as a news widget:
      - when user clicks on a date, a news search interface appears
      - if a date within the past 30 days is clicked, news relevant to the user's search criteria published on that day will be displayed
      - if any other date is clicked, the latest published news relevant to the user's search criteria will be displayed 
      
  - Stock market:
    - lookup financial details and current events related to a specific company
    - autocomplete search bar allows user to type in a company name for matching stock symbol suggestions
    - buy shares from a company at real-time prices
    
  - Stocks portfolio:
    - displays the stocks and financial information owned by the user
      - shares owned, symbol, name, share price, day high, day low, day change
    - sell shares owned by the user at real-time prices
    
  - Net worth:
    - Current net worth: total and breakdown of the user's net worth
    - Historical net worth: graphical depiction of the uers's net worth within the past 60 days
    - Daily growth rates: graphical depicition of the average daily growth rate and daily growth rates within the past 60 days
    
  - Balance:
    - displays the user's current cash balance
    
  - Logout:
    - allows the user to logout of their account

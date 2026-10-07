# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: MonthlyAnnualBillingChangeMatrix.spec.ts >> Monthly To Annual Billing Change Use Case 5 Matrix >> SC-196 - Annual savings messaging is displayed accurately
- Location: tests\MonthlyAnnualBillingChangeMatrix.spec.ts:361:13

# Error details

```
Error: Plans screen should say how much annual billing saves. Annual is $290/yr vs $34.80/yr paid monthly, but no savings message is shown.

expect(received).toBeTruthy()

Received: false
```

# Test source

```ts
  1778 |         'Income Builder',
  1779 |         'monthly'
  1780 |       );
  1781 | 
  1782 |       ctx.state.paidBeforeChange =
  1783 |         await countPaidTransactions(
  1784 |           ctx
  1785 |         );
  1786 | 
  1787 |       await ctx.billing.validateOverview();
  1788 | 
  1789 |       await changePlan(
  1790 |         ctx,
  1791 |         {
  1792 |           targetPlan:
  1793 |             'Income Builder',
  1794 |           action: 'interval',
  1795 |           interval: 'annual'
  1796 |         }
  1797 |       );
  1798 | 
  1799 |       await ctx.billing.validateActivePlan(
  1800 |         'Income Builder'
  1801 |       );
  1802 | 
  1803 |       ctx.state.paidAfterChange =
  1804 |         await countPaidTransactions(
  1805 |           ctx
  1806 |         );
  1807 |     },
  1808 |     steps: {
  1809 |       'entitlements-preserved':
  1810 |         async (ctx) => {
  1811 |           await stepActivePlan(
  1812 |             ctx,
  1813 |             'Income Builder'
  1814 |           );
  1815 |         },
  1816 | 
  1817 |       'transaction-history':
  1818 |         async (ctx) => {
  1819 |           await stepTransactionPaidCount(
  1820 |             ctx,
  1821 |             1
  1822 |           );
  1823 |         },
  1824 | 
  1825 |       // Switching to annual is charged immediately as the annual price
  1826 |       // minus the credit for the unused part of the monthly period.
  1827 |       'annual-amount':
  1828 |         async (ctx) => {
  1829 |           await stepTransactionAmount(
  1830 |             ctx,
  1831 |             Number(
  1832 |               (
  1833 |                 PLAN_PRICES['Income Builder'].annual -
  1834 |                 PLAN_PRICES['Income Builder'].monthly
  1835 |               ).toFixed(2)
  1836 |             ),
  1837 |             true
  1838 |           );
  1839 |         },
  1840 | 
  1841 |       'subscription-history':
  1842 |         async (ctx) => {
  1843 |           await stepHistoryMatches(
  1844 |             ctx,
  1845 |             /(annual|yearly)/i,
  1846 |             'Subscription History should record the switch to annual billing.'
  1847 |           );
  1848 |         },
  1849 | 
  1850 |       'invoice-pdf-opens':
  1851 |         stepInvoicePdfOpens,
  1852 | 
  1853 |       'annual-savings-message':
  1854 |         async (ctx) => {
  1855 |           await openPlansTab(ctx);
  1856 | 
  1857 |           await ctx.page
  1858 |             .getByRole('button', {
  1859 |               name: /^annual/i
  1860 |             })
  1861 |             .first()
  1862 |             .click();
  1863 | 
  1864 |           const text =
  1865 |             await mainText(ctx);
  1866 | 
  1867 |           const annual =
  1868 |             PLAN_PRICES['Income Builder'].annual;
  1869 | 
  1870 |           const monthly =
  1871 |             PLAN_PRICES['Income Builder'].monthly;
  1872 | 
  1873 |           expect(
  1874 |             /save\s+\$?\d|save up to|\d+\s*%\s*(off|savings?)|\d+\s*months?\s*free|annual savings|you save/i.test(
  1875 |               text
  1876 |             ),
  1877 |             `Plans screen should say how much annual billing saves. Annual is $${annual}/yr vs $${(monthly * 12).toFixed(2)}/yr paid monthly, but no savings message is shown.`
> 1878 |           ).toBeTruthy();
       |             ^ Error: Plans screen should say how much annual billing saves. Annual is $290/yr vs $34.80/yr paid monthly, but no savings message is shown.
  1879 |         },
  1880 | 
  1881 |       'confirmation-email':
  1882 |         async (ctx) => {
  1883 |           await waitForEmail(
  1884 |             ctx,
  1885 |             'billing interval confirmation',
  1886 |             (mail) =>
  1887 |               subjectMatches(
  1888 |                 mail,
  1889 |                 /annual|yearly|billing (interval|cycle|period)|plan (has )?(changed|updated)|subscription (updated|changed)|switch/i
  1890 |               )
  1891 |           );
  1892 |         },
  1893 | 
  1894 |       'saved-card-preserved':
  1895 |         stepSavedCardPreserved,
  1896 | 
  1897 |       'no-checkout-reprompt':
  1898 |         stepNoCheckoutReprompt,
  1899 | 
  1900 |       'single-active-plan':
  1901 |         stepExactlyOneCurrentPlan
  1902 |     }
  1903 |   },
  1904 | 
  1905 |   INTERVAL_INCOME_ANNUAL_TO_MONTHLY: {
  1906 |     setup: async (ctx) => {
  1907 |       await buyPlan(
  1908 |         ctx,
  1909 |         'Income Builder',
  1910 |         'annual'
  1911 |       );
  1912 | 
  1913 |       await ctx.billing.validateOverview();
  1914 | 
  1915 |       await changePlan(
  1916 |         ctx,
  1917 |         {
  1918 |           targetPlan:
  1919 |             'Income Builder',
  1920 |           action: 'interval',
  1921 |           interval: 'monthly'
  1922 |         }
  1923 |       );
  1924 | 
  1925 |       await ctx.billing.validateActivePlan(
  1926 |         'Income Builder'
  1927 |       );
  1928 |     },
  1929 |     steps: {
  1930 |       'confirmation-shows-scheduled':
  1931 |         async (ctx) => {
  1932 |           expect(
  1933 |             ctx.state.changeDialogText,
  1934 |             'Annual-to-monthly confirmation should say whether the change is immediate or scheduled.'
  1935 |           ).toMatch(
  1936 |             /next renewal|scheduled|takes effect|end of|effective/i
  1937 |           );
  1938 |         },
  1939 | 
  1940 |       'subscription-history':
  1941 |         async (ctx) => {
  1942 |           await stepHistoryMatches(
  1943 |             ctx,
  1944 |             /(switch|change|scheduled)[\s\S]{0,80}monthly|monthly[\s\S]{0,80}(scheduled|takes effect)/i,
  1945 |             'Subscription History should record the scheduled switch to monthly billing (the only entry today is the annual purchase).'
  1946 |           );
  1947 |         },
  1948 | 
  1949 |       // No new charge happens at switch time, so the PDF checked here is
  1950 |       // the existing annual invoice that must stay downloadable.
  1951 |       'invoice-pdf-opens':
  1952 |         stepInvoicePdfOpens,
  1953 | 
  1954 |       'overview-shows-scheduled-monthly':
  1955 |         async (ctx) => {
  1956 |           await ctx.billing.validateOverview();
  1957 | 
  1958 |           await expect(
  1959 |             ctx.page.locator('main'),
  1960 |             'Billing overview should show the scheduled switch to monthly billing and its effective date.'
  1961 |           ).toContainText(
  1962 |             /(switch|change|billing)[\s\S]{0,60}monthly[\s\S]{0,120}(scheduled|takes effect)|scheduled[\s\S]{0,80}monthly/i,
  1963 |             {
  1964 |               timeout: 15000
  1965 |             }
  1966 |           );
  1967 |         },
  1968 | 
  1969 |       'loss-of-savings-message':
  1970 |         async (ctx) => {
  1971 |           expect(
  1972 |             ctx.state.changeDialogText,
  1973 |             'Annual-to-monthly confirmation should warn that the annual savings are lost.'
  1974 |           ).toMatch(
  1975 |             /sav(e|ing)|lose|no longer|annual (discount|pricing)|higher/i
  1976 |           );
  1977 |         },
  1978 | 
```
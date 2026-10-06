# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: AcademyDepth.spec.ts >> Academy depth >> Academy opens the next lesson without marking it complete
- Location: tests\AcademyDepth.spec.ts:809:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: /mark as complete|marked complete|undo/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('button', { name: /mark as complete|marked complete|undo/i })

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - img [ref=e4]
  - heading "This page couldn’t load" [level=1] [ref=e6]
  - paragraph [ref=e7]: Reload to try again, or go back.
  - generic [ref=e8]:
    - button "Reload" [ref=e10] [cursor=pointer]
    - button "Back" [ref=e11] [cursor=pointer]
```

# Test source

```ts
  745 |             )
  746 |           ).toContainText(
  747 |             card.content
  748 |           );
  749 |         }
  750 | 
  751 |         await openAcademy(
  752 |           page
  753 |         );
  754 | 
  755 |         await safeClick(
  756 |           page.getByRole(
  757 |             'link',
  758 |             {
  759 |               name: /all beginner strategies/i
  760 |             }
  761 |           ),
  762 |           'All beginner strategies'
  763 |         );
  764 | 
  765 |         await expect(
  766 |           page
  767 |         ).toHaveURL(
  768 |           /complexity=Beginner/i
  769 |         );
  770 | 
  771 |         await expect(
  772 |           page.locator(
  773 |             'main'
  774 |           )
  775 |         ).toContainText(
  776 |           /beginner|covered call/i
  777 |         );
  778 | 
  779 |         await openAcademy(
  780 |           page
  781 |         );
  782 | 
  783 |         await safeClick(
  784 |           page.getByRole(
  785 |             'link',
  786 |             {
  787 |               name: /sell one call option against 100 shares/i
  788 |             }
  789 |           ).first(),
  790 |           'Open Covered Call strategy'
  791 |         );
  792 | 
  793 |         await expect(
  794 |           page
  795 |         ).toHaveURL(
  796 |           /\/academy\/strategies\/covered-call/
  797 |         );
  798 | 
  799 |         await expect(
  800 |           page.locator(
  801 |             'main'
  802 |           )
  803 |         ).toContainText(
  804 |           /max gain|premium|strike/i
  805 |         );
  806 |       }
  807 |     );
  808 | 
  809 |     test(
  810 |       'Academy opens the next lesson without marking it complete',
  811 |       async ({ page }) => {
  812 |         await openAcademy(
  813 |           page,
  814 |           '/academy/lessons'
  815 |         );
  816 | 
  817 |         await safeClick(
  818 |           page.getByRole(
  819 |             'link',
  820 |             {
  821 |               name: /reading an options chain/i
  822 |             }
  823 |           ).first(),
  824 |           'Open next lesson'
  825 |         );
  826 | 
  827 |         await expect(
  828 |           page.locator(
  829 |             'main'
  830 |           )
  831 |         ).toContainText(
  832 |           /options chain|bid|ask|strike|expiration/i,
  833 |           {
  834 |             timeout: 15000
  835 |           }
  836 |         );
  837 | 
  838 |         await expect(
  839 |           page.getByRole(
  840 |             'button',
  841 |             {
  842 |               name: /mark as complete|marked complete|undo/i
  843 |             }
  844 |           )
> 845 |         ).toBeVisible();
      |           ^ Error: expect(locator).toBeVisible() failed
  846 |       }
  847 |     );
  848 | 
  849 |     test(
  850 |       'Beginners lesson opens without marking it complete',
  851 |       async ({ page }) => {
  852 |         await openAcademy(
  853 |           page,
  854 |           '/academy/beginners'
  855 |         );
  856 | 
  857 |         await safeClick(
  858 |           page.getByRole(
  859 |             'link',
  860 |             {
  861 |               name: /why might investors use options/i
  862 |             }
  863 |           ).first(),
  864 |           'Open unmarked beginner lesson'
  865 |         );
  866 | 
  867 |         await expect(
  868 |           page
  869 |         ).toHaveURL(
  870 |           /\/academy\/beginners/
  871 |         );
  872 | 
  873 |         await expect(
  874 |           page.locator(
  875 |             'main'
  876 |           )
  877 |         ).toContainText(
  878 |           /investor|option|hedge|income/i
  879 |         );
  880 | 
  881 |         const completeLesson =
  882 |           page.getByRole(
  883 |             'button',
  884 |             {
  885 |               name: /^mark as complete$/i
  886 |             }
  887 |           );
  888 | 
  889 |         if (
  890 |           await completeLesson.count()
  891 |         ) {
  892 |           await expect(
  893 |             completeLesson
  894 |           ).toBeVisible();
  895 |         }
  896 |       }
  897 |     );
  898 | 
  899 |     test(
  900 |       'Strategy library opens Protective Put and returns',
  901 |       async ({ page }) => {
  902 |         await openAcademy(
  903 |           page,
  904 |           '/academy'
  905 |         );
  906 | 
  907 |         await safeClick(
  908 |           page.getByRole(
  909 |             'link',
  910 |             {
  911 |               name: /^strategy library$/i
  912 |             }
  913 |           ).first(),
  914 |           'Strategy library'
  915 |         );
  916 | 
  917 |         await safeClick(
  918 |           page.locator(
  919 |             'main'
  920 |           ).getByRole(
  921 |             'button',
  922 |             {
  923 |               name: /^protection\b/i
  924 |             }
  925 |           ),
  926 |           'Protection strategies'
  927 |         );
  928 | 
  929 |         const strategy =
  930 |           page.locator(
  931 |             'main a'
  932 |           ).filter({
  933 |             hasText: /explore scenario/i
  934 |           }).first();
  935 | 
  936 |         await strategy.scrollIntoViewIfNeeded();
  937 | 
  938 |         await safeClick(
  939 |           strategy,
  940 |           'Open Protective Put'
  941 |         );
  942 | 
  943 |         await expect(
  944 |           page
  945 |         ).toHaveURL(
```
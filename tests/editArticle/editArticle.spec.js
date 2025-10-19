import { expect, test } from '@playwright/test';
import { createNewArticle } from '../../src/ui/actions/article/createNewArticle';
import { generateNewUserData } from '../../src/common/testData/generateNewUserData';
import { generateNewArticleData } from '../../src/common/testData/generateNewArticleData';
import { signUpUser } from '../../src/ui/actions/auth/signUpUser';
import { ViewArticlePage } from '../../src/ui/pages/article/ViewArticlePage';
import { CreateArticlePage } from '../../src/ui/pages/article/CreateArticlePage';
import { HomePage } from '../../src/ui/pages/HomePage';

let user;
let viewArticlePage;
let createArticlePage;
let homePage;
let article;
let articleData;

test.beforeEach(async ({ page }) => {
  user = generateNewUserData();
  await signUpUser(page, user); 
  viewArticlePage = new ViewArticlePage(page);
  createArticlePage = new CreateArticlePage(page);
  homePage = new HomePage(page);
  return user;
});

test('Edit the article title for the existing article', async ({page}) => {
  const articleData = generateNewArticleData();
  article = await createNewArticle(page);
  await viewArticlePage.clickEditButton();
  await createArticlePage.fillTitleField(articleData.title);
  await page.waitForTimeout(2000);
  await createArticlePage.clickUpdateArticleButton();
  await viewArticlePage.assertArticleTitleIsUpdated(articleData.title);
});

test('Edit the article description for the existing article',
  async ({page}) => {
  articleData = generateNewArticleData();
  article = await createNewArticle(page);
  await viewArticlePage.clickEditButton();
  await createArticlePage.fillDescriptionField(articleData.description);
  await page.waitForTimeout(2000);
  await createArticlePage.clickUpdateArticleButton();
  await page.waitForTimeout(2000);
  await homePage.clickUserAvatar();
  await homePage.assertArticDescriptionIsUpdated(articleData.description);
});

test('Edit the article text for the existing article', async ({page}) => {
  articleData = generateNewArticleData();
  article = await createNewArticle(page);
  await viewArticlePage.clickEditButton();
  await createArticlePage.fillTextField(articleData.text);
  await page.waitForTimeout(2000);
  await createArticlePage.clickUpdateArticleButton();
  await page.waitForTimeout(2000);
  //await expect(page.locator('.col-md-12')).toContainText(articleData.text);
  await viewArticlePage.assertArticleTextIsUpdated(articleData.text);
});

test('Add the tag for the existing article without tags', async ({page}) => {
  articleData = generateNewArticleData(1);
  article = await createNewArticle(page);
  await viewArticlePage.clickEditButton();
  await createArticlePage.fillTagsField(articleData.tags);
  await page.waitForTimeout(2000);
  await createArticlePage.clickUpdateArticleButton();
  await viewArticlePage.assertTagUpdated(articleData.tags);
});

test('Add the tag for the existing article with tags', async ({page}) => {
  articleData = generateNewArticleData(2);
  article = await createNewArticle(page, 2);
  await viewArticlePage.clickEditButton();
  await createArticlePage.fillTagsField(articleData.tags);
  await page.waitForTimeout(2000);
  await createArticlePage.clickPublishArticleButton();
  await page.waitForTimeout(2000);
  await viewArticlePage.assertTagUpdated(article.tags, articleData.tags);
  //await viewArticlePage.assertTagUpdated(articleData.tags);
});

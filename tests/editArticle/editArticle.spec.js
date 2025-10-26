import { expect, test } from '@playwright/test';
import { createArticle } from '../../src/ui/actions/article/createNewArticle';
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
  article = await createArticle(page);
  await viewArticlePage.clickEditButton();
  await createArticlePage.fillTitleField(articleData.title);
  await createArticlePage.clickUpdateArticleButton();
  await viewArticlePage.assertArticleTitleIsUpdated(articleData.title);
});

test('Edit the article description for the existing article',
  async ({page}) => {
  articleData = generateNewArticleData();
  article = await createArticle(page);
  await viewArticlePage.clickEditButton();
  await createArticlePage.fillDescriptionField(articleData.description);
  await createArticlePage.clickUpdateArticleButton();
  await viewArticlePage.waitForArticlePutResponse();
  await homePage.clickUserAvatar();
  await homePage.assertArticDescriptionIsUpdated(articleData.description);
});

test('Edit the article text for the existing article', async ({page}) => {
  articleData = generateNewArticleData();
  article = await createArticle(page);
  await viewArticlePage.clickEditButton();
  await createArticlePage.fillTextField(articleData.text);
  await createArticlePage.clickUpdateArticleButton();
  await viewArticlePage.assertArticleTextIsUpdated(articleData.text);
});

test('Add the tag for the existing article without tags', async ({page}) => {
  articleData = generateNewArticleData(1);
  article = await createArticle(page);
  await viewArticlePage.clickEditButton();
  await createArticlePage.fillTagsField(articleData.tags);
  await createArticlePage.clickUpdateArticleButton();
  await viewArticlePage.assertTagsAdded(articleData.tags);
});

test('Add the tag for the existing article with tags', async ({page}) => {
  articleData = generateNewArticleData(2);
  article = await createArticle(page, 2);
  await viewArticlePage.clickEditButton();
  await createArticlePage.fillTagsField(articleData.tags);
  await createArticlePage.clickPublishArticleButton();
  await viewArticlePage.assertTagUpdated(article.tags, articleData.tags);
});

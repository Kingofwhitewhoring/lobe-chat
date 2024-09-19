import { Avatar, Tag } from '@lobehub/ui';
import { Skeleton, Typography } from 'antd';
import { createStyles } from 'antd-style';
import { startCase } from 'lodash-es';
import dynamic from 'next/dynamic';
import qs from 'query-string';
import { memo } from 'react';
import { Center, Flexbox, FlexboxProps } from 'react-layout-kit';
import urlJoin from 'url-join';

import { DiscoverAssistantItem } from '@/types/discover';

import CardBanner from '../../../components/CardBanner';
import GitHubAvatar from '../../../components/GitHubAvatar';
import { useCategoryItem } from '../../assistants/features/useCategory';

const Link = dynamic(() => import('next/link'), {
  loading: () => <Skeleton.Button size={'small'} style={{ height: 22 }} />,
  ssr: false,
});

const { Paragraph, Title } = Typography;

const useStyles = createStyles(({ css, token, isDarkMode }) => ({
  banner: css`
    opacity: ${isDarkMode ? 0.9 : 0.4};
  `,
  container: css`
    cursor: pointer;

    position: relative;

    overflow: hidden;

    height: 100%;
    min-height: 162px;

    background: ${token.colorBgContainer};
    border-radius: ${token.borderRadiusLG}px;
    box-shadow: 0 0 1px 1px ${isDarkMode ? token.colorFillQuaternary : token.colorFillSecondary}
      inset;

    transition: box-shadow 0.2s ${token.motionEaseInOut};

    &:hover {
      box-shadow: 0 0 1px 1px ${isDarkMode ? token.colorFillSecondary : token.colorFill} inset;
    }
  `,
  desc: css`
    min-height: 44px;
    margin-block-end: 0 !important;
    color: ${token.colorTextDescription};
  `,

  time: css`
    color: ${token.colorTextDescription};
  `,
  title: css`
    margin-block-end: 0 !important;
    font-weight: bold;
  `,
}));

export interface AssistantCardProps
  extends Omit<DiscoverAssistantItem, 'suggestions' | 'socialData' | 'config'>,
    Omit<FlexboxProps, 'children'> {
  showCategory?: boolean;
  variant?: 'default' | 'compact';
}

const AssistantCard = memo<AssistantCardProps>(
  ({ showCategory, className, meta, createdAt, author, variant, ...rest }) => {
    const { avatar, title, description, tags = [], category } = meta;
    const { cx, styles, theme } = useStyles();
    const categoryItem = useCategoryItem(category, 12);
    const isCompact = variant === 'compact';

    const user = (
      <Flexbox
        align={'center'}
        gap={6}
        horizontal
        style={{ color: theme.colorTextSecondary, fontSize: 12 }}
      >
        <GitHubAvatar size={18} username={author} />
        <span>{author}</span>
      </Flexbox>
    );

    return (
      <Flexbox className={cx(styles.container, className)} gap={24} {...rest}>
        {!isCompact && <CardBanner avatar={avatar} />}
        <Flexbox gap={12} padding={16}>
          <Flexbox
            align={isCompact ? 'flex-start' : 'flex-end'}
            gap={16}
            horizontal
            justify={'space-between'}
            style={{ position: 'relative' }}
            width={'100%'}
          >
            <Flexbox
              gap={8}
              style={{ overflow: 'hidden', paddingTop: isCompact ? 4 : 0, position: 'relative' }}
            >
              <Title
                className={styles.title}
                ellipsis={{ rows: 1, tooltip: title }}
                level={3}
                style={{ fontSize: isCompact ? 16 : 18 }}
              >
                {title}
              </Title>
              {isCompact && user}
            </Flexbox>
            {isCompact ? (
              <Avatar avatar={avatar} size={40} style={{ display: 'block' }} title={title} />
            ) : (
              <Center
                flex={'none'}
                height={64}
                style={{
                  background: theme.colorBgContainer,
                  borderRadius: '50%',
                  marginTop: -6,
                  overflow: 'hidden',
                  zIndex: 2,
                }}
                width={64}
              >
                <Avatar avatar={avatar} size={56} style={{ display: 'block' }} title={title} />
              </Center>
            )}
          </Flexbox>
          {!isCompact && (
            <Flexbox gap={8} horizontal style={{ fontSize: 12 }}>
              {user}
              <time className={styles.time} dateTime={new Date(createdAt).toISOString()}>
                {createdAt}
              </time>
            </Flexbox>
          )}
          <Paragraph className={styles.desc} ellipsis={{ rows: 2 }}>
            {description}
          </Paragraph>
          <Flexbox gap={6} horizontal style={{ flexWrap: 'wrap' }}>
            {showCategory && categoryItem ? (
              <Link href={urlJoin('/discover/assistants', categoryItem.key)}>
                <Tag icon={categoryItem.icon} style={{ margin: 0 }}>
                  {categoryItem.label}
                </Tag>
              </Link>
            ) : (
              tags
                .slice(0, 4)
                .filter(Boolean)
                .map((tag: string, index) => {
                  const url = qs.stringifyUrl({
                    query: { q: tag, type: 'assistants' },
                    url: '/discover/search',
                  });
                  return (
                    <Link href={url} key={index}>
                      <Tag style={{ margin: 0 }}>{startCase(tag).trim()}</Tag>
                    </Link>
                  );
                })
            )}
          </Flexbox>
        </Flexbox>
      </Flexbox>
    );
  },
);

export default AssistantCard;
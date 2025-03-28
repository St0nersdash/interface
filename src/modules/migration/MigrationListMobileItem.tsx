import { InterestRate } from '@aave/contract-helpers';
import { ExclamationCircleIcon } from '@heroicons/react/outline';
import { ArrowNarrowRightIcon, CheckIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { Box, Button, SvgIcon, Typography, useTheme } from '@mui/material';
import { IncentivesCard } from 'src/components/incentives/IncentivesCard';
import { MigrationDisabledTooltip } from 'src/components/infoTooltips/MigrationDisabledTooltip';
import { IsolatedBadge } from 'src/components/isolationMode/IsolatedBadge';
import { ListColumn } from 'src/components/lists/ListColumn';
import { ListItem } from 'src/components/lists/ListItem';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { ROUTES } from 'src/components/primitives/Link';
import { NoData } from 'src/components/primitives/NoData';
import { Row } from 'src/components/primitives/Row';
import { TokenIcon } from 'src/components/primitives/TokenIcon';
import { ComputedUserReserveData } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useRootStore } from 'src/store/root';
import { MigrationDisabled, V3Rates } from 'src/store/v3MigrationSelectors';

import { MigrationListItemToggler } from './MigrationListItemToggler';

interface MigrationListMobileItemProps {
  checked: boolean;
  amount: string;
  amountInUSD: string;
  onCheckboxClick: () => void;
  disabled?: MigrationDisabled;
  enabledAsCollateral?: boolean;
  canBeEnforced?: boolean;
  enableAsCollateral?: () => void;
  isIsolated?: boolean;
  enteringIsolation: boolean;
  borrowApyType?: string;
  userReserve: ComputedUserReserveData;
  v3Rates?: V3Rates;
  showCollateralToggle?: boolean;
}

export const MigrationListMobileItem = ({
  checked,
  amount,
  amountInUSD,
  onCheckboxClick,
  enabledAsCollateral,
  disabled,
  enableAsCollateral,
  isIsolated,
  enteringIsolation,
  borrowApyType,
  userReserve,
  v3Rates,
  showCollateralToggle,
}: MigrationListMobileItemProps) => {
  const v2APY = borrowApyType
    ? borrowApyType === InterestRate.Stable
      ? userReserve.stableBorrowAPY
      : userReserve.reserve.variableBorrowAPY
    : userReserve.reserve.supplyAPY;
  const v2Incentives = borrowApyType
    ? borrowApyType === InterestRate.Stable
      ? userReserve.reserve.sIncentivesData
      : userReserve.reserve.vIncentivesData
    : userReserve.reserve.aIncentivesData;
  const v3APY = borrowApyType ? v3Rates?.variableBorrowAPY || '-1' : v3Rates?.supplyAPY || '-1';
  const v3Incentives = borrowApyType
    ? v3Rates?.vIncentivesData || []
    : v3Rates?.aIncentivesData || [];

  const { currentMarket, currentMarketData } = useRootStore();
  const theme = useTheme();
  const baseColorSecondary = disabled === undefined ? 'text.secondary' : 'text.muted';
  const baseColorPrimary = disabled === undefined ? 'text.primary' : 'text.muted';

  return (
    <ListItem sx={{ display: 'flex', flexDirection: 'column', pl: 0 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          pb: 2,
          pt: 2.5,
        }}
      >
        <ListColumn align="center" maxWidth={48} minWidth={48}>
          <Box
            sx={(theme) => ({
              border: `2px solid ${
                disabled !== undefined
                  ? theme.palette.action.disabled
                  : theme.palette.text.secondary
              }`,
              background:
                disabled !== undefined
                  ? theme.palette.background.disabled
                  : checked
                  ? theme.palette.text.secondary
                  : theme.palette.background.paper,
              width: 16,
              height: 16,
              borderRadius: '2px',
              '&:hover': {
                cursor: disabled !== undefined ? 'not-allowed' : 'pointer',
              },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            })}
            onClick={disabled !== undefined ? undefined : onCheckboxClick}
          >
            {disabled === undefined && (
              <SvgIcon sx={{ fontSize: '14px', color: 'background.paper' }}>
                <CheckIcon />
              </SvgIcon>
            )}
          </Box>
        </ListColumn>

        <ListColumn align="left">
          <Row>
            <TokenIcon symbol={userReserve.reserve.iconSymbol} fontSize="large" />

            <Box sx={{ pl: '12px', overflow: 'hidden', display: 'flex' }}>
              <Typography variant="subheader1" color={baseColorPrimary} noWrap sx={{ pr: 1 }}>
                {userReserve.reserve.symbol}
              </Typography>
              {disabled !== undefined && (
                <MigrationDisabledTooltip
                  dashboardLink={ROUTES.dashboard + '/?marketName=' + currentMarket + '_v3'}
                  marketName={currentMarketData.marketTitle}
                  warningType={disabled}
                  isolatedV3={enteringIsolation}
                />
              )}
            </Box>
          </Row>
        </ListColumn>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', pl: 12 }}>
        <Typography variant="description" color={baseColorSecondary}>
          <Trans>Current v2 Balance</Trans>
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 0.5 }}>
            <FormattedNumber value={amount} variant="secondary14" color={baseColorPrimary} />
          </Box>
          <FormattedNumber
            value={amountInUSD}
            variant="secondary12"
            color={baseColorSecondary}
            symbolsColor={baseColorSecondary}
            symbol="USD"
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          pl: 12,
          py: 2,
        }}
      >
        <Typography variant="description" color={baseColorSecondary}>
          <Trans>APY change</Trans>
        </Typography>

        <Box sx={{ display: 'flex' }}>
          <IncentivesCard
            value={v2APY}
            symbol={userReserve.reserve.symbol}
            incentives={v2Incentives}
            variant="main14"
            color={baseColorPrimary}
          />
          <SvgIcon sx={{ px: 1.5 }}>
            <ArrowNarrowRightIcon
              fontSize="14px"
              color={
                disabled === undefined ? theme.palette.text.secondary : theme.palette.text.muted
              }
            />
          </SvgIcon>
          <IncentivesCard
            value={v3APY}
            symbol={userReserve.reserve.symbol}
            incentives={v3Incentives}
            variant="main14"
            color={baseColorPrimary}
          />
        </Box>
      </Box>

      {!!enableAsCollateral && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            pl: 12,
            pb: 4,
          }}
        >
          <Typography variant="description" color={baseColorSecondary}>
            <Trans>Collateral change</Trans>
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {userReserve.usageAsCollateralEnabledOnUser &&
            userReserve.reserve.usageAsCollateralEnabled ? (
              <CheckRoundedIcon fontSize="small" color="success" />
            ) : (
              <NoData variant="main14" color={baseColorSecondary} />
            )}

            <SvgIcon sx={{ px: 1.5 }}>
              <ArrowNarrowRightIcon
                fontSize="14px"
                color={
                  disabled === undefined ? theme.palette.text.secondary : theme.palette.text.muted
                }
              />
            </SvgIcon>

            {showCollateralToggle ? (
              <MigrationListItemToggler
                enableAsCollateral={enableAsCollateral}
                enabledAsCollateral={enabledAsCollateral}
              />
            ) : !enabledAsCollateral ? (
              <NoData variant="main14" color={baseColorSecondary} />
            ) : isIsolated ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <SvgIcon sx={{ color: 'warning.main', fontSize: '20px' }}>
                  <ExclamationCircleIcon />
                </SvgIcon>
                <IsolatedBadge />
              </Box>
            ) : (
              <CheckRoundedIcon fontSize="small" color="success" />
            )}
          </Box>
        </Box>
      )}

      {!!borrowApyType && (
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', pl: 12, pb: 4 }}
        >
          <Typography variant="description" color={baseColorSecondary}>
            <Trans>APY type change</Trans>
          </Typography>
          <Box sx={{ display: 'flex' }}>
            <Button
              variant="outlined"
              size="small"
              sx={{ width: '50px', background: 'white' }}
              disabled
            >
              <Typography variant="buttonS" color={baseColorPrimary}>
                {borrowApyType}
              </Typography>
            </Button>
            <SvgIcon sx={{ px: 1.5 }}>
              <ArrowNarrowRightIcon
                fontSize="14px"
                color={
                  disabled === undefined ? theme.palette.text.secondary : theme.palette.text.muted
                }
              />
            </SvgIcon>
            <Button
              variant="outlined"
              size="small"
              sx={{ width: '50px', background: 'white' }}
              disabled
            >
              <Typography variant="buttonS" color={baseColorPrimary}>
                Variable
              </Typography>
            </Button>
          </Box>
        </Box>
      )}
    </ListItem>
  );
};

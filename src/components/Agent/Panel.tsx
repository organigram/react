import {
  useEffect,
  useRef,
  type FormEvent,
  type KeyboardEvent
} from 'react'
import type { OrganigramJson } from '@organigram/js'
import type {
  WorkspaceAgentCitation,
  WorkspaceAgentMessage,
  WorkspaceAgentOrganigramPreview,
  WorkspaceAgentResponse,
  WorkspaceAgentThread
} from './types'
import AddIcon from '@mui/icons-material/Add'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { workspaceNavHeight } from '../../theme'
import {
  WorkspaceAgentChatMessage,
  WorkspaceAgentStreamBox
} from './Chat'
import {
  WorkspaceAgentPreview,
  type WorkspaceAgentPreviewLabels
} from './Preview'

export type WorkspaceAgentPanelMessage = WorkspaceAgentMessage & {
  id?: string
  response?: WorkspaceAgentResponse
  streaming?: boolean
}

export type WorkspaceAgentPanelLabels = WorkspaceAgentPreviewLabels & {
  title: string
  close: string
  threads: string
  newChat: string
  noConversationsYet: string
  thinking: string
  askPlaceholder: string
  sourceHero: string
  sourceWorkspace: string
}

const defaultLabels: WorkspaceAgentPanelLabels = {
  title: 'Workspace agent',
  close: 'Close',
  threads: 'Threads',
  newChat: 'New chat',
  noConversationsYet: 'No conversations yet.',
  thinking: 'Thinking...',
  askPlaceholder: 'Ask your organization...',
  sourceHero: 'Hero',
  sourceWorkspace: 'Workspace',
  preview: 'Preview',
  confirmationNotice: 'This preview will only be saved after confirmation.',
  organ: 'organ',
  newOrgan: 'new organ',
  newProcedure: 'new procedure',
  newAsset: 'new asset',
  newEntry: 'new entry',
  entry: 'entry',
  organType: 'Organ',
  procedureType: 'Procedure',
  assetType: 'Asset',
  cancel: 'Cancel',
  confirm: 'Confirm'
}

const panelWidth = 520
const panelZIndex = 1500

const getPreviewKey = (
  messageIndex: number,
  preview: WorkspaceAgentOrganigramPreview
): string =>
  preview.type === 'organigram'
    ? `${messageIndex}:${preview.organigramId}`
    : `${messageIndex}:new-organigram`

export const WorkspaceAgentPanel: React.FC<{
  open: boolean
  onClose: () => void
  showThreadList: boolean
  onShowThreadList: () => void
  threads: WorkspaceAgentThread[]
  selectedThreadId: string | null
  historyLoading: boolean
  onSelectThread: (threadId: string) => void
  onStartNewThread: () => void
  messages: WorkspaceAgentPanelMessage[]
  welcomeMessage: string
  currentOrganigram: OrganigramJson | null
  canAsk: boolean
  canConfirmPreview: boolean
  savingPreviewKey: string | null
  dismissedPreviewIndexes: number[]
  input: string
  loading: boolean
  error: string | null
  onInputChange: (value: string) => void
  onInputKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onConfirmPreview: (
    preview: WorkspaceAgentOrganigramPreview,
    messageIndex: number
  ) => void
  onCancelPreview: (messageIndex: number) => void
  labels?: Partial<WorkspaceAgentPanelLabels>
}> = ({
  open,
  onClose,
  showThreadList,
  onShowThreadList,
  threads,
  selectedThreadId,
  historyLoading,
  onSelectThread,
  onStartNewThread,
  messages,
  welcomeMessage,
  currentOrganigram,
  canAsk,
  canConfirmPreview,
  savingPreviewKey,
  dismissedPreviewIndexes,
  input,
  loading,
  error,
  onInputChange,
  onInputKeyDown,
  onSubmit,
  onConfirmPreview,
  onCancelPreview,
  labels: customLabels
}) => {
  const labels = { ...defaultLabels, ...customLabels }
  const normalizedInput = input.trim()
  const messagesScrollRef = useRef<HTMLDivElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (messagesScrollRef.current != null) {
        messagesScrollRef.current.scrollTop =
          messagesScrollRef.current.scrollHeight
      }
      messagesEndRef.current?.scrollIntoView({ block: 'end' })
    })

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [loading, messages])

  const sourceLabel = (source: WorkspaceAgentThread['source']): string =>
    source === 'hero' ? labels.sourceHero : labels.sourceWorkspace

  return (
    <Drawer
      id='workspace-agent-panel'
      anchor='right'
      variant='persistent'
      open={open}
      onClose={onClose}
      sx={{ zIndex: panelZIndex }}
      PaperProps={{
        sx: {
          zIndex: panelZIndex,
          mt: `${workspaceNavHeight + 13}px`,
          mr: '13px',
          height: `calc(100% - ${workspaceNavHeight + 24}px)`,
          pb: `${workspaceNavHeight + 8}px`,
          boxSizing: 'border-box',
          width: { xs: 'calc(100% - 26px)', sm: `${panelWidth}px` },
          maxWidth: '100vw',
          overflow: 'hidden',
          borderLeft: 'none',
          borderRadius: '16px',
          boxShadow: '0 18px 48px rgba(15, 23, 42, 0.16)'
        }
      }}
    >
      <Box
        component='section'
        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          sx={({ palette }) => ({
            px: 2,
            py: 1.5,
            borderBottom: `1px solid ${palette.grey[200]}`
          })}
        >
          <Stack direction='row' gap={1} alignItems='center'>
            <AutoAwesomeIcon fontSize='small' />
            <Typography variant='h2' fontSize='16px' letterSpacing='0'>
              {labels.title}
            </Typography>
          </Stack>
          <IconButton aria-label={labels.close} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Stack sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {showThreadList ? (
            <Box
              id='workspace-agent-thread-list'
              sx={{ overflowY: 'auto', flex: 1 }}
            >
              <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center'
                px={2}
                pt={1.5}
                pb={1}
              >
                <Typography variant='h3' fontSize='14px' letterSpacing='0'>
                  {labels.threads}
                </Typography>
                <Button
                  id='workspace-agent-new-thread-button'
                  size='small'
                  variant='text'
                  startIcon={<AddIcon fontSize='small' />}
                  onClick={onStartNewThread}
                >
                  {labels.newChat}
                </Button>
              </Stack>
              {historyLoading ? (
                <Stack alignItems='center' py={2}>
                  <CircularProgress size={18} />
                </Stack>
              ) : null}
              {!historyLoading && threads.length === 0 ? (
                <Typography
                  variant='body2'
                  color='text.secondary'
                  px={2}
                  pb={2}
                >
                  {labels.noConversationsYet}
                </Typography>
              ) : null}
              <List dense disablePadding>
                {threads.map(thread => (
                  <ListItemButton
                    id='workspace-agent-thread-item'
                    key={thread.id}
                    selected={thread.id === selectedThreadId}
                    onClick={() => {
                      onSelectThread(thread.id)
                    }}
                    sx={{ alignItems: 'flex-start', px: 2, py: 1.25 }}
                  >
                    <Stack gap={0.5} minWidth={0}>
                      <Typography
                        variant='body2'
                        fontWeight={600}
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {thread.title}
                      </Typography>
                      <Chip
                        id={`workspace-agent-thread-source-${thread.source}`}
                        size='small'
                        label={sourceLabel(thread.source)}
                        sx={{ alignSelf: 'flex-start', height: 22 }}
                      />
                    </Stack>
                  </ListItemButton>
                ))}
              </List>
            </Box>
          ) : (
            <>
              <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center'
                px={2}
                py={1}
                sx={({ palette }) => ({
                  borderBottom: `1px solid ${palette.grey[200]}`
                })}
              >
                <Button
                  id='workspace-agent-show-threads-button'
                  variant='text'
                  size='small'
                  onClick={onShowThreadList}
                >
                  {labels.threads}
                </Button>
                <Button
                  id='workspace-agent-new-thread-button'
                  size='small'
                  variant='text'
                  startIcon={<AddIcon fontSize='small' />}
                  onClick={onStartNewThread}
                >
                  {labels.newChat}
                </Button>
              </Stack>
              <Box
                ref={messagesScrollRef}
                sx={{ p: 2, overflowY: 'auto', flex: 1, minHeight: 0 }}
              >
                <Typography variant='body2' color='text.secondary' mb={2}>
                  {welcomeMessage}
                </Typography>
                <Stack gap={1.5}>
                  {messages.map((message, index) => {
                    const isAssistant = message.role === 'assistant'
                    const preview = message.response?.preview
                    const previewDismissed =
                      dismissedPreviewIndexes.includes(index)
                    return (
                      <Box key={message.id ?? `${message.role}-${index}`}>
                        {message.streaming === true && isAssistant ? (
                          <WorkspaceAgentStreamBox
                            content={message.content}
                            thinkingLabel={labels.thinking}
                          />
                        ) : (
                          <WorkspaceAgentChatMessage
                            role={message.role}
                            content={message.content}
                            thinkingLabel={labels.thinking}
                          />
                        )}
                        {isAssistant && message.response?.citations != null ? (
                          <Stack
                            direction='row'
                            flexWrap='wrap'
                            gap={0.5}
                            mt={1}
                          >
                            {message.response.citations.map(
                              (citation: WorkspaceAgentCitation) => (
                                <Chip
                                  id={`workspace-agent-citation-${citation.type}`}
                                  key={`${citation.type}-${citation.id}`}
                                  size='small'
                                  variant='outlined'
                                  label={citation.label}
                                />
                              )
                            )}
                          </Stack>
                        ) : null}
                        {preview != null && !previewDismissed ? (
                          <WorkspaceAgentPreview
                            preview={preview}
                            currentOrganigram={
                              preview.type === 'new-organigram'
                                ? null
                                : currentOrganigram
                            }
                            canConfirm={canConfirmPreview}
                            saving={
                              savingPreviewKey === getPreviewKey(index, preview)
                            }
                            onConfirm={() => {
                              onConfirmPreview(preview, index)
                            }}
                            onCancel={() => {
                              onCancelPreview(index)
                            }}
                            labels={labels}
                          />
                        ) : null}
                      </Box>
                    )
                  })}
                  {error != null ? (
                    <Alert id='workspace-agent-error' severity='error'>
                      {error}
                    </Alert>
                  ) : null}
                  <Box ref={messagesEndRef} />
                </Stack>
              </Box>

              <Divider />
              <Box component='form' onSubmit={onSubmit} sx={{ p: 2 }}>
                <Stack direction='row' gap={1} alignItems='flex-end'>
                  <TextField
                    id='workspace-agent-input'
                    fullWidth
                    multiline
                    minRows={1}
                    maxRows={4}
                    value={input}
                    disabled={!canAsk || loading}
                    placeholder={labels.askPlaceholder}
                    onChange={event => {
                      onInputChange(event.target.value)
                    }}
                    onKeyDown={onInputKeyDown}
                  />
                  <Button
                    id='workspace-agent-send-button'
                    type='submit'
                    variant='contained'
                    disabled={!canAsk || normalizedInput === '' || loading}
                    sx={{ minWidth: 44, height: 44 }}
                  >
                    {loading ? <CircularProgress size={18} /> : <SendIcon />}
                  </Button>
                </Stack>
              </Box>
            </>
          )}
        </Stack>
      </Box>
    </Drawer>
  )
}

export { defaultLabels as defaultWorkspaceAgentPanelLabels }

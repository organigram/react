import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { WorkspaceAgentAnimated } from './Animated'

export type WorkspaceAgentChatRole = 'user' | 'assistant'

export const WorkspaceAgentChatMessage: React.FC<{
  role: WorkspaceAgentChatRole
  content: string
  streaming?: boolean
  thinkingLabel?: string
}> = ({ role, content, streaming = false, thinkingLabel = 'Thinking...' }) => {
  const isAssistant = role === 'assistant'
  const visibleContent =
    content.trim() !== '' ? content : streaming ? thinkingLabel : ''

  return (
    <WorkspaceAgentAnimated visible translateY={8} cursor='inherit'>
      <Box
        sx={{
          display: 'flex',
          justifyContent: isAssistant ? 'flex-start' : 'flex-end'
        }}
      >
        <Box
          id={
            isAssistant
              ? 'workspace-agent-assistant-message'
              : 'workspace-agent-user-message'
          }
          sx={({ palette }) => ({
            backgroundColor: isAssistant
              ? palette.grey[100]
              : palette.primary.main,
            color: isAssistant ? 'text.primary' : 'primary.contrastText',
            borderRadius: 2,
            px: 1.5,
            py: 1,
            maxWidth: '100%',
            whiteSpace: 'pre-wrap'
          })}
        >
          {streaming && content.trim() === '' ? (
            <Stack direction='row' gap={1} alignItems='center'>
              <CircularProgress size={16} />
              <Typography variant='body2'>{visibleContent}</Typography>
            </Stack>
          ) : (
            <Typography variant='body2'>{visibleContent}</Typography>
          )}
        </Box>
      </Box>
    </WorkspaceAgentAnimated>
  )
}

export const WorkspaceAgentStreamBox: React.FC<{
  content: string
  thinkingLabel?: string
}> = ({ content, thinkingLabel }) => (
  <WorkspaceAgentChatMessage
    role='assistant'
    content={content}
    streaming
    thinkingLabel={thinkingLabel}
  />
)

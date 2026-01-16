import React from 'react';
import { Box, Container, Typography, Button, Paper, Stack } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/**
 * Error Boundary Component
 * Catches and displays unexpected errors gracefully
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    this.setState((prevState) => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Log to error tracking service (Sentry, etc.)
    if (process.env.REACT_APP_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  logErrorToService = (error, errorInfo) => {
    // TODO: Integrate with error tracking service
    console.error('Error logged to service:', { error, errorInfo });
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = process.env.REACT_APP_ENV === 'development';

      return (
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Box
            component={Paper}
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              borderTop: '4px solid',
              borderTopColor: 'error.main',
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              Oops! Something went wrong
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              We encountered an unexpected error. Our team has been notified. Please try again or contact support.
            </Typography>

            {isDevelopment && this.state.error && (
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 1,
                  textAlign: 'left',
                  maxHeight: 300,
                  overflow: 'auto',
                  fontFamily: 'monospace',
                  fontSize: 12,
                }}
              >
                <Typography variant="caption" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                  Error Details (Development Only):
                </Typography>
                <Typography variant="caption" component="div" sx={{ color: 'error.main', mb: 1 }}>
                  {this.state.error.toString()}
                </Typography>
                {this.state.errorInfo && (
                  <Typography variant="caption" component="pre" sx={{ color: '#666', whiteSpace: 'pre-wrap' }}>
                    {this.state.errorInfo.componentStack}
                  </Typography>
                )}
              </Box>
            )}

            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
              <Button variant="contained" color="primary" onClick={this.handleReset}>
                Try Again
              </Button>
              <Button variant="outlined" color="primary" onClick={this.handleReload}>
                Go to Dashboard
              </Button>
            </Stack>

            {this.state.errorCount > 3 && (
              <Typography variant="caption" color="warning.main" sx={{ display: 'block', mt: 2 }}>
                Multiple errors detected. Please refresh the page or clear your browser cache.
              </Typography>
            )}
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

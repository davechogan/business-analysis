AI_CONFIG = {
    'strategy': {
        'model': 'gpt-3.5-turbo',
        'temperature': 0.7,
        'system_role': 'You are a strategic business analyst with expertise in market analysis and business strategy.',
        'dependencies': []
    },
    'competitors': {
        'model': 'gpt-3.5-turbo',
        'temperature': 0.7,
        'system_role': 'You are a competitive intelligence expert.',
        'dependencies': ['strategy']
    },
    'revenue': {
        'model': 'gpt-3.5-turbo',
        'temperature': 0.7,
        'system_role': 'You are a revenue analysis expert.',
        'dependencies': ['strategy', 'competitors']
    }
}